import json

from langchain_core.tools import tool

from app.clients.rag_client import RagClient
from app.exceptions import ExternalServiceError


def create_rag_tool(client: RagClient):
    @tool
    async def search_medical_knowledge(query: str) -> str:
        """Search MedNavigator's retrieved medical knowledge. Use when a healthcare answer
        needs grounded, source-backed information. Do not use for greetings or casual chat.
        The returned context and sources must be followed faithfully."""
        try:
            result = await client.search(query)
            return json.dumps(result)
        except ExternalServiceError:
            # The model can tell the user knowledge retrieval is currently unavailable.
            return json.dumps({"error": "Medical knowledge retrieval is currently unavailable."})

    return search_medical_knowledge
