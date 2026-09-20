from typing import Dict, Any
from app.models.token_models import UserContext

class PolicyDecisionPoint:
    """
    ABAC Engine: Dynamically maps user contextual attributes to
    metadata retrieval boundaries in ChromaDB.
    """

    @staticmethod
    def evaluate_retrieval_policy(context: UserContext) -> Dict[str, Any]:
        """
        Generates dynamic ChromaDB metadata filter predicates:
        1. User can only see chunks with clearance <= user's clearance level.
        2. User can only see chunks from their own department OR 'general' (public) docs.
        3. 'admin' department bypasses department boundary but respects clearance.
        """
        clearance_condition = {"clearance": {"$lte": context.clearance}}

        # Executive / Admin override
        if context.department == "admin":
            return clearance_condition

        # Standard ABAC constraint: (dept == user_dept OR dept == general) AND clearance <= user_clearance
        department_condition = {
            "$or": [
                {"department": context.department},
                {"department": "general"}
            ]
        }

        return {
            "$and": [
                clearance_condition,
                department_condition
            ]
        }

pdp_engine = PolicyDecisionPoint()