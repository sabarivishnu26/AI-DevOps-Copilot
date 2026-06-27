import json
import re


def parse_llm_json(response: str):
    response = response.strip()

    # Remove ```json ... ```
    response = re.sub(r"^```json", "", response)
    response = re.sub(r"^```", "", response)
    response = re.sub(r"```$", "", response)

    response = response.strip()

    return json.loads(response)