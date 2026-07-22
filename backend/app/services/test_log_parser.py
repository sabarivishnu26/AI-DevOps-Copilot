import unittest
import json
from app.services.log_parser import parse_devops_logs

class TestLogParser(unittest.TestCase):
    
    def test_standard_bracket_log(self):
        log_data = "2026-07-22 19:46:23,123 [INFO] [auth-service] User logged in successfully"
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 1)
        
        entry = results[0]
        self.assertEqual(entry["timestamp"], "2026-07-22 19:46:23,123")
        self.assertEqual(entry["severity"], "INFO")
        self.assertEqual(entry["service"], "auth-service")
        self.assertEqual(entry["message"], "User logged in successfully")
        self.assertIsNone(entry["exception"])
        self.assertIsNone(entry["stack_trace"])

    def test_syslog_format(self):
        log_data = "Jul 22 19:46:23 host-123 database: Connection refused to master replica"
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 1)
        
        entry = results[0]
        self.assertEqual(entry["timestamp"], "Jul 22 19:46:23")
        self.assertEqual(entry["severity"], "INFO") # default if not specified
        self.assertEqual(entry["service"], "database")
        self.assertEqual(entry["message"], "Connection refused to master replica")
        self.assertIsNone(entry["exception"])
        self.assertIsNone(entry["stack_trace"])

    def test_inline_severity_no_brackets(self):
        log_data = "2026-07-22T19:46:23.456Z ERROR billing-service: Payment processing failed"
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 1)
        
        entry = results[0]
        self.assertEqual(entry["timestamp"], "2026-07-22T19:46:23.456Z")
        self.assertEqual(entry["severity"], "ERROR")
        self.assertEqual(entry["service"], "billing-service")
        self.assertEqual(entry["message"], "Payment processing failed")

    def test_python_traceback(self):
        log_data = """2026-07-22 19:46:23 [ERROR] [auth-service] User login failed on endpoint
Traceback (most recent call last):
  File "auth.py", line 10, in login
    check_password(username, password)
  File "crypto.py", line 5, in check_password
    raise ValueError("Invalid credentials")
ValueError: Invalid credentials
2026-07-22 19:46:24 [INFO] [auth-service] Retrying..."""
        
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 2)
        
        error_entry = results[0]
        self.assertEqual(error_entry["severity"], "ERROR")
        self.assertEqual(error_entry["service"], "auth-service")
        self.assertEqual(error_entry["message"], "User login failed on endpoint")
        self.assertEqual(error_entry["exception"], "ValueError")
        self.assertIsNotNone(error_entry["stack_trace"])
        self.assertIn("File \"auth.py\", line 10, in login", error_entry["stack_trace"])
        self.assertIn("ValueError: Invalid credentials", error_entry["stack_trace"])

        info_entry = results[1]
        self.assertEqual(info_entry["severity"], "INFO")
        self.assertEqual(info_entry["message"], "Retrying...")

    def test_java_stack_trace(self):
        log_data = """2026-07-22 19:46:23 [FATAL] [gateway] Gateway routing failure
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.hashCode()" because "str" is null
\tat com.example.myproject.Book.getTitle(Book.java:16)
\tat com.example.myproject.Author.getName(Author.java:25)
\tat com.example.myproject.Main.main(Main.java:10)
Caused by: java.io.IOException: Disk full
\tat java.base/java.io.FileOutputStream.write(FileOutputStream.java:290)
\t... 12 more"""
        
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 1)
        
        entry = results[0]
        self.assertEqual(entry["severity"], "FATAL")
        self.assertEqual(entry["service"], "gateway")
        self.assertEqual(entry["exception"], "java.lang.NullPointerException")
        self.assertIsNotNone(entry["stack_trace"])
        self.assertIn("Caused by: java.io.IOException: Disk full", entry["stack_trace"])

    def test_inline_exception(self):
        log_data = "2026-07-22 19:46:23 ERROR [payment-gateway] ConnectionTimeoutError: failed to connect to bank API"
        results = parse_devops_logs(log_data)
        self.assertEqual(len(results), 1)
        
        entry = results[0]
        self.assertEqual(entry["exception"], "ConnectionTimeoutError")
        self.assertEqual(entry["message"], "ConnectionTimeoutError: failed to connect to bank API")

if __name__ == "__main__":
    unittest.main()
