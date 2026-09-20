import hashlib
import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
from app.models.token_models import UserContext

# Configure structured JSON SIEM log file
LOG_DIR = Path(__file__).resolve().parent.parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "zta_audit_events.jsonl"

audit_logger = logging.getLogger("ZTA_SIEM_AUDITOR")
audit_logger.setLevel(logging.INFO)
audit_logger.propagate = False

if not audit_logger.handlers:
    file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    formatter = logging.Formatter("%(message)s")
    file_handler.setFormatter(formatter)
    audit_logger.addHandler(file_handler)

class SIEMAuditLogger:
    @staticmethod
    def _compute_sha256(data: str) -> str:
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    @classmethod
    def log_event(
        cls,
        event_type: str,
        user_context: Optional[UserContext],
        raw_query: str,
        decision: str,  # ALLOW, DENY, REDACT
        retrieved_chunk_ids: List[str] = None,
        security_flags: List[str] = None,
        extra_details: Dict[str, Any] = None,
    ) -> str:
        """
        Emits an immutable structured JSON-Lines telemetry record.
        """
        event_id = str(uuid.uuid4())
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_id": event_id,
            "event_type": event_type,
            "decision": decision,
            "subject": {
                "user_id": user_context.user_id if user_context else "ANONYMOUS",
                "department": user_context.department if user_context else "UNKNOWN",
                "clearance": user_context.clearance if user_context else 0,
            },
            "request_metadata": {
                "query_sha256": cls._compute_sha256(raw_query),
                "query_length": len(raw_query),
            },
            "retrieval": {
                "chunks_count": len(retrieved_chunk_ids) if retrieved_chunk_ids else 0,
                "chunk_ids": retrieved_chunk_ids or [],
            },
            "threat_telemetry": {
                "guardrail_flags": security_flags or [],
            },
            "context": extra_details or {},
        }

        # Write to JSONL log file
        audit_logger.info(json.dumps(record))
        return event_id

siem_logger = SIEMAuditLogger()