import os
from pathlib import Path
from typing import List, Dict, Any
from app.vector_store.chroma_store import vector_store

# Points to 'backend/app'
APP_DIR = Path(__file__).resolve().parent.parent

def find_document_file(filename_stem: str) -> str:
    """Finds the document path inside app/data/ with or without .txt extension."""
    data_dir = APP_DIR / "data"
    for candidate in [data_dir / f"{filename_stem}.txt", data_dir / filename_stem]:
        if candidate.exists() and candidate.is_file():
            return str(candidate)
    return ""

def load_and_tag_documents() -> List[Dict[str, Any]]:
    """Loads document files and attaches security classification metadata."""
    documents_config = [
        {
            "stem": "public_docs",
            "department": "general",
            "clearance": 1,
            "prefix": "pub"
        },
        {
            "stem": "engineering_docs",
            "department": "engineering",
            "clearance": 2,
            "prefix": "eng"
        },
        {
            "stem": "finance_docs",
            "department": "finance",
            "clearance": 3,
            "prefix": "fin"
        }
    ]

    records = []
    
    for item in documents_config:
        file_path = find_document_file(item["stem"])
        if not file_path:
            print(f"[!] Warning: Could not locate data file for '{item['stem']}' at {APP_DIR / 'data'}")
            continue

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Split into non-empty lines for chunking
        raw_chunks = [c.strip() for c in content.split("\n") if len(c.strip()) > 15]

        for idx, chunk in enumerate(raw_chunks):
            records.append({
                "id": f"{item['prefix']}_chunk_{idx + 1}",
                "content": chunk,
                "metadata": {
                    "department": item["department"],
                    "clearance": item["clearance"]
                }
            })

    return records

def run_ingestion():
    """Ingests classified chunks into ChromaDB."""
    print("[*] Starting Zero-Trust Document Ingestion Pipeline...")
    records = load_and_tag_documents()
    
    if not records:
        print("[!] No documents found to ingest. Make sure files in app/data/ contain text.")
        return

    ids = [r["id"] for r in records]
    docs = [r["content"] for r in records]
    metadatas = [r["metadata"] for r in records]

    vector_store.add_documents(ids=ids, documents=docs, metadatas=metadatas)
    print(f"Successfully ingested {len(records)} chunks with security ACLs.")

if __name__ == "__main__":
    run_ingestion()