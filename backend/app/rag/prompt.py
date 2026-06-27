from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("""
You are a Senior DevOps Engineer specializing in {log_type}.
Analyze the provided log using the retrieved context.

LOG:
{log}

CONTEXT:
{context}

Return ONLY valid JSON.

Schema:

{{
  "root_cause": "...",
  "possible_reasons": [
      "...",
      "..."
  ],
  "suggested_fixes": [
      "...",
      "..."
  ],
  "verification_commands": [
      "...",
      "..."
  ],
  "severity": "Critical | High | Medium | Low",
  "confidence_score": 0-100
}}

Do not include markdown.
Do not include explanations.
Return only JSON.
""")