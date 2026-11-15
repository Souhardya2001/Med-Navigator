from typing import Annotated, Any, TypedDict

from langgraph.graph.message import add_messages


class AgentState(TypedDict, total=False):
    user_query: str
    chat_history: list[dict[str, str]]
    user_context: dict[str, Any]
    messages: Annotated[list[Any], add_messages]
    rag_context: list[Any]
    hospital_results: list[dict[str, Any]]
    tools_used: list[dict[str, str]]
    sources: list[dict[str, Any]]
    final_response: str
  