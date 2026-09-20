import re
from typing import Tuple, Dict, List

class OutputDLPGuardrail:
    """
    Scans LLM output to prevent data exfiltration, secret leakage, and PII exposure.
    """

    PATTERNS: Dict[str, re.Pattern] = {
        "EMAIL": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"),
        "API_KEY": re.compile(r"(AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36})"),
        "IPV4_INTERNAL": re.compile(r"\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b"),
        "CREDIT_CARD": re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b"),
        "SSN": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    }

    @classmethod
    def sanitize(cls, text: str) -> Tuple[str, bool, List[str]]:
        """
        Scans and redacts detected PII / secrets.
        Returns:
            (sanitized_text, was_modified, list_of_detected_entity_types)
        """
        redacted_text = text
        detected_types: List[str] = []

        for entity_type, pattern in cls.PATTERNS.items():
            if pattern.search(redacted_text):
                detected_types.append(entity_type)
                redacted_text = pattern.sub(f"[REDACTED_{entity_type}]", redacted_text)

        was_modified = len(detected_types) > 0
        return redacted_text, was_modified, detected_types

output_guardrail = OutputDLPGuardrail()