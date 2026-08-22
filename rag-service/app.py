import os
import logging
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.search import RAGSearch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag-service")

# ---------------------------------------------------------------------------
# Config (override via environment variables / .env)
# ---------------------------------------------------------------------------

PERSIST_DIR = os.getenv("FAISS_PERSIST_DIR", "faiss_store")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

rag_search_instance: Optional[RAGSearch] = None


# ---------------------------------------------------------------------------
# Lifespan: load the embedding model + FAISS index + LLM client ONCE at
# startup, not on every request (this is the expensive part).
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global rag_search_instance
    logger.info("Initializing RAG pipeline (embedding model, FAISS index, Groq client)...")
    try:
        rag_search_instance = RAGSearch(
            persist_dir=PERSIST_DIR,
            embedding_model=EMBEDDING_MODEL,
            llm_model=LLM_MODEL,
        )
        logger.info("RAG pipeline ready.")
    except Exception as e:
        logger.exception("Failed to initialize RAG pipeline: %s", e)
        raise
    yield
    logger.info("Shutting down RAG service.")


app = FastAPI(
    title="CareCompass RAG Service",
    description="Internal FastAPI microservice exposing RAG retrieval + summarization to the chat-service (Node.js).",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User's natural language question")
    top_k: int = Field(5, ge=1, le=20, description="Number of chunks to retrieve")


class QueryResponse(BaseModel):
    query: str
    summary: str


class SearchResultItem(BaseModel):
    index: int
    distance: float
    text: str


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem]


# ---------------------------------------------------------------------------
# Dependency helper
# ---------------------------------------------------------------------------
def get_rag() -> RAGSearch:
    if rag_search_instance is None:
        raise HTTPException(status_code=503, detail="RAG service is not initialized yet.")
    return rag_search_instance


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
def health_check():
    """Used by the Node.js API gateway for service discovery / readiness checks."""
    return {"status": "ok", "initialized": rag_search_instance is not None}


@app.post("/query", response_model=QueryResponse)
def query_rag(payload: QueryRequest):
    """
    Full RAG pipeline: retrieve relevant chunks + summarize them via the LLM.
    This is what chat-service should call for a symptom/question turn.
    """
    rag = get_rag()
    try:
        summary = rag.search_and_summarize(payload.query, top_k=payload.top_k)
    except Exception as e:
        logger.exception("Error during search_and_summarize")
        raise HTTPException(status_code=500, detail=f"RAG query failed: {e}")
    return QueryResponse(query=payload.query, summary=summary)


@app.post("/search", response_model=SearchResponse)
def raw_search(payload: QueryRequest):
    """
    Retrieval only, no LLM call. Useful if Node wants to do its own
    formatting, ranking, or pass raw chunks to another model.
    """
    rag = get_rag()
    try:
        results = rag.vectorstore.query(payload.query, top_k=payload.top_k)
    except Exception as e:
        logger.exception("Error during raw vector search")
        raise HTTPException(status_code=500, detail=f"Vector search failed: {e}")

    items = [
        SearchResultItem(
            index=int(r["index"]),
            distance=float(r["distance"]),
            text=(r["metadata"] or {}).get("text", ""),
        )
        for r in results
    ]
    return SearchResponse(query=payload.query, results=items)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)