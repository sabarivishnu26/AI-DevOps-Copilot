import re
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Pydantic model for structured log output
class LogEntry(BaseModel):
    timestamp: Optional[str] = Field(None, description="Extracted timestamp from the log line")
    severity: Optional[str] = Field("INFO", description="Log level/severity (e.g. INFO, ERROR, WARNING)")
    service: Optional[str] = Field(None, description="Service or component name")
    message: str = Field(..., description="Main log message content")
    exception: Optional[str] = Field(None, description="Exception name/class if present")
    stack_trace: Optional[str] = Field(None, description="Stack trace or traceback content if present")


# Common timestamp regex patterns (supporting dot or comma for milliseconds)
TIMESTAMP_PATTERNS = [
    r'\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?', # ISO 8601/RFC 3339
    r'[A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}',                               # Syslog (Jul 22 19:46:23)
    r'\d{2}/\d{2}/\d{4}\s+\d{2}:\d{2}:\d{2}',                                      # Common format (22/07/2026 19:46:23)
]
TIMESTAMP_COMBINED = '|'.join(TIMESTAMP_PATTERNS)
TIMESTAMP_REGEX = re.compile(rf'({TIMESTAMP_COMBINED})')

# Header line pattern: Starts with (or has near start) a timestamp
HEADER_REGEX = re.compile(rf'^\s*\[?({TIMESTAMP_COMBINED})\]?\s*(.*)$')

# Severity levels pattern
SEVERITY_REGEX = re.compile(
    r'\b(DEBUG|INFO|WARN(?:ING)?|ERROR|CRITICAL|FATAL)\b', 
    re.IGNORECASE
)

# Exception patterns
# Matches e.g. "ValueError: details" or "java.lang.NullPointerException: details"
EXCEPTION_CLASS_REGEX = re.compile(
    r'\b([a-zA-Z0-9_\.]*(?:Exception|Error|Failure|Err))\b'
)
EXCEPTION_MSG_REGEX = re.compile(
    r'\b([a-zA-Z0-9_\.]*(?:Exception|Error|Failure|Err)):\s*(.*)$'
)

# Stack trace indicator lines
STACK_TRACE_INDICATORS = [
    re.compile(r'^\s*Traceback \(most recent call last\):'),
    re.compile(r'^\s*Exception in thread'),
    re.compile(r'^\s*at [a-zA-Z0-9_\.\$\<]+\('),
    re.compile(r'^\s*-\s+locked\s+<'),
    re.compile(r'^\s*...\s+\d+\s+more'),
    re.compile(r'^\s*File "[^"]+", line \d+'),
]


def is_stack_trace_line(line: str, in_progress: bool = False) -> bool:
    """
    Determines if a line is part of a stack trace / traceback.
    """
    if any(pattern.match(line) for pattern in STACK_TRACE_INDICATORS):
        return True
    if line.strip().startswith("Caused by:"):
        return True
    if in_progress:
        # If we are already parsing a stack trace, check if this line is indented
        # or if it's the exception message line at the end (e.g. "ValueError: ...")
        if line.startswith(" ") or line.startswith("\t"):
            return True
        if EXCEPTION_MSG_REGEX.match(line.strip()):
            return True
    return False


def parse_header_metadata(rest: str) -> tuple[Optional[str], Optional[str], str]:
    """
    Extracts severity, service/component, and cleans up the message from the non-timestamp part of a log header line.
    """
    severity = None
    service = None
    cleaned_rest = rest

    # 1. Check for syslog style with hostname: "hostname service_name[123]: message" or "hostname service_name: message"
    syslog_match = re.match(r'^([a-zA-Z0-9_\-\.]+)\s+([a-zA-Z0-9_\-\.]+)(?:\[\d+\])?\s*:', cleaned_rest)
    if syslog_match:
        host_candidate = syslog_match.group(1)
        service_candidate = syslog_match.group(2)
        # Avoid false positives if host or service is a severity keyword
        if not SEVERITY_REGEX.match(host_candidate) and not SEVERITY_REGEX.match(service_candidate):
            service = service_candidate
            cleaned_rest = cleaned_rest[syslog_match.end():]

    # 2. Process bracketed contents (e.g. "[INFO] [auth-service] message")
    brackets = re.findall(r'\[([^\]]+)\]', cleaned_rest)
    
    for content in brackets:
        content_stripped = content.strip()
        # Check if severity
        sev_match = SEVERITY_REGEX.match(content_stripped)
        if sev_match and not severity:
            severity = sev_match.group(1).upper()
            cleaned_rest = cleaned_rest.replace(f"[{content}]", "", 1)
        # Check if it could be a service (e.g., lowercase alphanumeric with dashes/dots/slashes)
        elif not service and re.match(r'^[a-zA-Z0-9_\-\./]+$', content_stripped):
            service = content_stripped
            cleaned_rest = cleaned_rest.replace(f"[{content}]", "", 1)
            
    # 3. If severity or service not found, check outside brackets
    # Check severity
    if not severity:
        sev_match = SEVERITY_REGEX.search(cleaned_rest)
        if sev_match:
            severity = sev_match.group(1).upper()
            # Remove severity from string
            cleaned_rest = cleaned_rest.replace(sev_match.group(0), "", 1)
            
    # Check service using "service-name:" pattern or "service-name - " pattern
    if not service:
        # e.g., "billing-service: Payment failed"
        service_match = re.search(r'\b([a-zA-Z0-9_\-\.]+)\s*:', cleaned_rest)
        if not service_match:
            # e.g., "billing-service - Payment failed"
            service_match = re.search(r'\b([a-zA-Z0-9_\-\.]+)\s+-\s+', cleaned_rest)
            
        if service_match:
            candidate = service_match.group(1)
            # Make sure candidate is not a severity or just numeric
            if not SEVERITY_REGEX.match(candidate) and not candidate.isdigit():
                service = candidate
                cleaned_rest = cleaned_rest.replace(service_match.group(0), "", 1)

    # 4. Clean up the message
    # Remove leading/trailing whitespace and punctuation like colons, dashes, or spaces
    message = cleaned_rest.strip()
    message = re.sub(r'^[:\-\s]+', '', message)
    message = message.strip()
    
    return severity, service, message


def parse_devops_logs(logs: str) -> List[Dict[str, Any]]:
    """
    Parses raw DevOps log strings to extract structured fields:
    timestamp, severity, service, exception, stack trace, and message.
    
    This function is modular and suitable to be used as a LangGraph tool.
    
    Args:
        logs (str): The raw log data, potentially containing multiline entries and tracebacks.
        
    Returns:
        List[Dict[str, Any]]: A list of structured log entries as dictionaries.
    """
    if not logs:
        return []

    lines = logs.splitlines()
    entries: List[Dict[str, Any]] = []
    current_entry: Optional[Dict[str, Any]] = None
    parsing_stack_trace = False

    for line in lines:
        stripped_line = line.strip()
        if not stripped_line:
            # Keep blank lines if we're in the middle of a stack trace
            if current_entry and parsing_stack_trace:
                current_entry["stack_trace"] += line + "\n"
            continue

        # Check if this line is a new log entry header
        header_match = HEADER_REGEX.match(line)
        if header_match:
            # Finalize previous entry
            if current_entry:
                # Post-process message/exception before finalizing
                if not current_entry.get("exception"):
                    exc_match = EXCEPTION_MSG_REGEX.search(current_entry["message"])
                    if exc_match:
                        current_entry["exception"] = exc_match.group(1)
                entries.append(current_entry)
            
            # Start new entry
            timestamp = header_match.group(1)
            rest = header_match.group(2)
            severity, service, message = parse_header_metadata(rest)
            
            current_entry = {
                "timestamp": timestamp,
                "severity": severity or "INFO",
                "service": service,
                "message": message,
                "exception": None,
                "stack_trace": None
            }
            parsing_stack_trace = False
        else:
            # Not a header line. Check if it's a stack trace line or if we are already in stack trace mode
            is_st = is_stack_trace_line(line, parsing_stack_trace)
            
            if current_entry:
                if is_st:
                    parsing_stack_trace = True
                    if current_entry["stack_trace"] is None:
                        current_entry["stack_trace"] = ""
                    current_entry["stack_trace"] += line + "\n"
                    
                    # Try to extract exception from this stack trace line
                    exc_match = EXCEPTION_MSG_REGEX.search(line)
                    if exc_match and not current_entry.get("exception"):
                        current_entry["exception"] = exc_match.group(1)
                    else:
                        # Fallback: look for class name standalone if it's the start of exception
                        class_match = EXCEPTION_CLASS_REGEX.search(line)
                        if class_match and not current_entry["exception"]:
                            candidate = class_match.group(1)
                            # Avoid setting generic words
                            if candidate not in ["Error", "Exception", "Failure"]:
                                current_entry["exception"] = candidate
                else:
                    # Just a multi-line log message continuation
                    if current_entry["message"]:
                        current_entry["message"] += "\n" + stripped_line
                    else:
                        current_entry["message"] = stripped_line
                        
                    # Check for exception match in this continuation line
                    exc_match = EXCEPTION_MSG_REGEX.search(stripped_line)
                    if exc_match and not current_entry.get("exception"):
                        current_entry["exception"] = exc_match.group(1)
            else:
                # No current entry started, but we found a line. Let's start a fallback entry.
                current_entry = {
                    "timestamp": None,
                    "severity": "INFO",
                    "service": None,
                    "message": stripped_line,
                    "exception": None,
                    "stack_trace": None
                }
                
                # Check for exception in the fallback line
                exc_match = EXCEPTION_MSG_REGEX.search(stripped_line)
                if exc_match:
                    current_entry["exception"] = exc_match.group(1)

    # Finalize the last entry
    if current_entry:
        if not current_entry.get("exception"):
            exc_match = EXCEPTION_MSG_REGEX.search(current_entry["message"])
            if exc_match:
                current_entry["exception"] = exc_match.group(1)
        entries.append(current_entry)

    # Convert to schema and return validated dicts
    validated_entries = []
    for entry in entries:
        try:
            # Clean up trailing newlines in stack trace
            if entry["stack_trace"]:
                entry["stack_trace"] = entry["stack_trace"].rstrip()
            # Validate with Pydantic
            log_obj = LogEntry(**entry)
            if hasattr(log_obj, "model_dump"):
                validated_entries.append(log_obj.model_dump())
            else:
                validated_entries.append(log_obj.dict())
        except Exception:
            # Fallback if validation fails
            validated_entries.append(entry)

    return validated_entries
