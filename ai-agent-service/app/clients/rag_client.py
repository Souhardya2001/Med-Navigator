from typing import Any

from app.clients.base import BaseServiceClient
from app.exceptions import ExternalServiceError


class RagClient(BaseServiceClient):
    def __init__(self, base_url: str, path: str, timeout: float) -> None:
        super().__init__(base_url, timeout)
        self.path = path

    async def search(self, query: str) -> dict[str, Any]:
        body = await self._post(self.path, {"query": query})
        # Accept common service envelopes while requiring a searchable context.
        context = body.get("context", body.get("results", body.get("documents")))
        if context is None:
            raise ExternalServiceError("RAG service response has no context")
        if not isinstance(context, (str, list)):
            raise ExternalServiceError("RAG service returned invalid context")
        sources = body.get("sources", [])
        if not isinstance(sources, list):
            raise ExternalServiceError("RAG service returned invalid sources")
        return {"context": context, "sources": sources}