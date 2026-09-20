import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Any, Optional
from app.core.config import settings

class ChromaVectorStore:
    def __init__(self, collection_name: str = "zta_knowledge_base"):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"description": "Zero Trust Access Controlled Document Store"}
        )

    def add_documents(
        self,
        ids: List[str],
        documents: List[str],
        metadatas: List[Dict[str, Any]]
    ):
        """Ingests chunks alongside granular security metadata."""
        self.collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas
        )

    def authorized_query(
        self,
        query_text: str,
        where_filter: Dict[str, Any],
        n_results: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Executes semantic search constrained strictly by PDP authorization filters.
        ChromaDB will NOT return or load chunks that violate the metadata predicate.
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where=where_filter
        )
        
        retrieved_chunks = []
        if results and results.get("documents") and results["documents"][0]:
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            ids = results["ids"][0]
            distances = results.get("distances", [[None]])[0]

            for i in range(len(docs)):
                retrieved_chunks.append({
                    "chunk_id": ids[i],
                    "content": docs[i],
                    "department": metas[i].get("department", "general"),
                    "clearance": metas[i].get("clearance", 1),
                    "score": distances[i] if distances else None
                })
                
        return retrieved_chunks

# Global instance
vector_store = ChromaVectorStore()