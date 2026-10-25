import os
import json
import csv
import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, Response
from typing import List, Dict

router = APIRouter(prefix="/audit", tags=["Audit & Telemetry"])

LOG_FILE_PATH = os.path.abspath("backend/logs/zta_audit_events.jsonl")
# Fallback to local logs directory if run directly inside backend/
if not os.path.exists(LOG_FILE_PATH):
    LOG_FILE_PATH = os.path.abspath("logs/zta_audit_events.jsonl")


def _read_all_logs() -> List[Dict]:
    if not os.path.exists(LOG_FILE_PATH):
        return []
    logs = []
    with open(LOG_FILE_PATH, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                try:
                    logs.append(json.loads(line.strip()))
                except json.JSONDecodeError:
                    continue
    return logs


@router.get("/metrics")
def get_audit_metrics():
    logs = _read_all_logs()
    
    decisions = {"ALLOW": 0, "DENY": 0, "REDACT": 0}
    threat_types = {}
    risk_timeline = []

    for idx, entry in enumerate(logs):
        decision = entry.get("decision", "ALLOW")
        decisions[decision] = decisions.get(decision, 0) + 1

        event_type = entry.get("event_type", "UNKNOWN")
        if "BLOCKED" in event_type or "ALERT" in event_type or decision == "DENY":
            threat_types[event_type] = threat_types.get(event_type, 0) + 1

        # Read the logged session score directly from extra_details or flags
        extra = entry.get("extra_details", {})
        logged_score = extra.get("risk_score")
        
        if logged_score is None:
            # Fallback per event: show event impact rather than unbounded accumulation
            logged_score = 3 if ("INJECTION" in event_type or "ALERT" in event_type) else (1 if decision == "DENY" else 0)

        risk_timeline.append({
            "sequence": idx + 1,
            "timestamp": entry.get("timestamp", f"T{idx+1}"),
            "user_id": entry.get("user_id", "anonymous"),
            "risk_score": logged_score,
            "decision": decision
        })

    return {
        "total_queries": len(logs),
        "decisions": decisions,
        "threat_types": threat_types,
        "risk_timeline": risk_timeline[-25:],
    }


@router.get("/download/jsonl")
def download_jsonl():
    """Directly download raw SIEM JSONL audit log file."""
    if not os.path.exists(LOG_FILE_PATH):
        raise HTTPException(status_code=404, detail="No audit logs recorded yet.")
    return FileResponse(
        path=LOG_FILE_PATH,
        filename="siem_audit_events.jsonl",
        media_type="application/x-ndjson"
    )


@router.get("/download/csv")
def download_csv():
    """Generates and downloads a clean CSV report for enterprise compliance audit."""
    logs = _read_all_logs()
    if not logs:
        raise HTTPException(status_code=404, detail="No audit logs recorded yet.")

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Event ID", "Timestamp", "User ID", "Department", 
        "Clearance", "Decision", "Event Type", "Flags", "Chunks Used"
    ])

    for e in logs:
        # 1. Check every possible sub-dictionary where identity context might reside
        ctx = (
            e.get("user_context") 
            or e.get("user") 
            or e.get("actor") 
            or e.get("principal") 
            or e.get("context") 
            or {}
        )
        
        # 2. Extract User ID
        user_id = (
            ctx.get("user_id") 
            or ctx.get("sub") 
            or ctx.get("id") 
            or ctx.get("username")
            or e.get("user_id") 
            or e.get("sub") 
            or "N/A"
        )

        # 3. Extract Department
        department = (
            ctx.get("department") 
            or ctx.get("dept") 
            or e.get("department") 
            or e.get("dept") 
            or "N/A"
        )

        # 4. Extract Clearance Level
        clearance = (
            ctx.get("clearance") 
            if ctx.get("clearance") is not None 
            else ctx.get("clearance_level", e.get("clearance", e.get("clearance_level", "N/A")))
        )

        # 5. Extract Security Flags
        flags = e.get("security_flags") or e.get("flags") or []
        if isinstance(flags, list):
            flags_str = "; ".join(str(f) for f in flags)
        else:
            flags_str = str(flags)

        # 6. Extract Chunk Count
        chunks = e.get("retrieved_chunk_ids") or e.get("chunk_ids") or []
        chunks_count = len(chunks) if isinstance(chunks, list) else e.get("authorized_chunks_used", 0)

        writer.writerow([
            e.get("event_id", ""),
            e.get("timestamp", ""),
            user_id,
            department,
            clearance,
            e.get("decision", ""),
            e.get("event_type", ""),
            flags_str,
            chunks_count
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=siem_audit_report.csv"}
    )