import time
from typing import Dict, Tuple, Optional
from collections import defaultdict

class AdaptiveRiskEngine:
    def __init__(self, threshold: int = 3, cooldown_seconds: int = 300):
        self.threshold = threshold
        self.cooldown_seconds = cooldown_seconds
        # In-memory storage: user_id -> {"score": int, "violations": list, "last_violation": float, "is_quarantined": bool}
        self._user_risk_state: Dict[str, dict] = defaultdict(lambda: {
            "score": 0,
            "violations": [],
            "last_violation": 0.0,
            "is_quarantined": False
        })

    def record_violation(self, user_id: str, violation_type: str, weight: int = 1) -> Tuple[int, bool]:
        """
        Records an anomaly, increments score, and evaluates quarantine state.
        Returns: (current_risk_score, is_alert_triggered)
        """
        now = time.time()
        state = self._user_risk_state[user_id]

        # Reset score if cooldown period elapsed since the last incident
        if now - state["last_violation"] > self.cooldown_seconds and state["score"] > 0:
            state["score"] = 0
            state["violations"].clear()
            state["is_quarantined"] = False

        state["score"] += weight
        state["last_violation"] = now
        state["violations"].append({"type": violation_type, "timestamp": now})

        alert_triggered = False
        if state["score"] >= self.threshold:
            state["is_quarantined"] = True
            alert_triggered = True

        return state["score"], alert_triggered

    def is_quarantined(self, user_id: str) -> Tuple[bool, int]:
        """Checks if a user is currently locked out by the risk engine."""
        state = self._user_risk_state[user_id]
        now = time.time()

        if state["is_quarantined"]:
            if now - state["last_violation"] > self.cooldown_seconds:
                # Cooldown expired, lift quarantine
                state["is_quarantined"] = False
                state["score"] = 0
                state["violations"].clear()
                return False, 0
            return True, state["score"]

        return False, state["score"]

    def reset_user(self, user_id: str):
        """Admin unlock action."""
        if user_id in self._user_risk_state:
            del self._user_risk_state[user_id]


risk_engine = AdaptiveRiskEngine(threshold=3, cooldown_seconds=300)