import re
from typing import Tuple, List

class InputGuardrails:
    """
    Firewall for user inputs to prevent:
    - Direct Prompt Injection (jailbreaking / role-playing overrides)
    - System Prompt Leaks
    - Canary / Delimiter tampering
    """
    
    # Heuristic signature patterns for injection attempts
    INJECTION_PATTERNS: List[re.Pattern] = [
        re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)", re.IGNORECASE),
        re.compile(r"disregard\s+(all\s+)?(previous|prior)\s+(instructions|prompts)", re.IGNORECASE),
        re.compile(r"you\s+are\s+now\s+(dan|an\s+unrestricted|evil|jailbroken)", re.IGNORECASE),
        re.compile(r"system\s*:\s*override", re.IGNORECASE),
        re.compile(r"print\s+(your\s+)?(system\s+prompt|initial\s+instructions|hidden\s+rules)", re.IGNORECASE),
        re.compile(r"<\/?context>", re.IGNORECASE),  # Delimiter breakout attempt
        re.compile(r"bypass\s+(security|guardrails|filters|policy)", re.IGNORECASE),
    ]

    @classmethod
    def inspect_query(cls, query: str) -> Tuple[bool, str]:
        """
        Validates prompt security integrity.
        Returns:
            (is_safe: bool, threat_reason: str)
        """
        # 1. Structural checks
        if not query or len(query.strip()) < 2:
            return False, "Query cannot be empty."
        
        if len(query) > 2000:
            return False, "Query length exceeds maximum permissible threshold."

        # 2. Heuristic signature analysis
        for pattern in cls.INJECTION_PATTERNS:
            if pattern.search(query):
                return False, f"Prompt injection/jailbreak signature detected matching: {pattern.pattern}"

        return True, "Safe"

input_guardrail = InputGuardrails()