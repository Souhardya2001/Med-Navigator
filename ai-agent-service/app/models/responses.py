from typing import Any
from pydantic import BaseModel, Field


class Source(BaseModel):
    title: str | None = None
    url: str | None = None
    document_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ToolUsed(BaseModel):
    name: str


class AgentInvokeResponse(BaseModel):
    response: str
    tools_used: list[ToolUsed] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)
            