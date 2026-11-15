from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1, max_length=20_000)


class Location(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class UserContext(BaseModel):
    location: Location | None = None


class AgentInvokeRequest(BaseModel):
    query: str = Field(min_length=1, max_length=20_000)
    chat_history: list[ChatMessage] = Field(default_factory=list, max_length=100)
    user_context: UserContext | None = None
