import json
from typing import Any, Sequence

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import BaseTool
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

from app.agent.llm import bind_tools
from app.agent.prompts import SYSTEM_PROMPT
from app.agent.state import AgentState
from app.exceptions import AgentExecutionError


class MedNavigatorAgent:
    def __init__(self, llm: Any, tools: Sequence[BaseTool]) -> None:
        self.tools = list(tools)
        self.llm_with_tools = bind_tools(llm, self.tools)
        graph = StateGraph(AgentState)
        graph.add_node("agent", self._agent_node)
        graph.add_node("tools", ToolNode(self.tools, handle_tool_errors=True))
        graph.add_node("finalize", self._finalize_node)
        graph.add_edge(START, "agent")
        graph.add_conditional_edges("agent", self._route_after_agent, {"tools": "tools", "finalize": "finalize"})
        graph.add_edge("tools", "agent")
        graph.add_edge("finalize", END)
        self.graph = graph.compile()

    async def _agent_node(self, state: AgentState) -> dict[str, Any]:
        try:
            response = await self.llm_with_tools.ainvoke(state["messages"])
        except Exception as exc:
            print("LLM ERROR:", repr(exc))
            raise AgentExecutionError("LLM invocation failed") from exc
        return {"messages": [response]}

    @staticmethod
    def _route_after_agent(state: AgentState) -> str:
        last = state["messages"][-1]
        return "tools" if isinstance(last, AIMessage) and last.tool_calls else "finalize"

    @staticmethod
    def _json_content(message: ToolMessage) -> dict[str, Any] | None:
        content = message.content
        if isinstance(content, str):
            try:
                parsed = json.loads(content)
                return parsed if isinstance(parsed, dict) else None
            except json.JSONDecodeError:
                return None
        return content if isinstance(content, dict) else None

    def _finalize_node(self, state: AgentState) -> dict[str, Any]:
        tools_used: list[dict[str, str]] = []
        sources: list[dict[str, Any]] = []
        rag_context: list[Any] = []
        hospital_results: list[dict[str, Any]] = []
        for message in state["messages"]:
            if not isinstance(message, ToolMessage):
                continue
            print("\n========== TOOL RESULT ==========")
            print("Tool:", message.name)
            print("Content:", str(message.content)[:2000])
            print("=================================\n")
            name = message.name or "unknown_tool"
            if not any(item["name"] == name for item in tools_used):
                tools_used.append({"name": name})
            result = self._json_content(message) or {}
            if name == "search_medical_knowledge":
                if "context" in result:
                    rag_context.append(result["context"])
                sources.extend(item for item in result.get("sources", []) if isinstance(item, dict))
            elif name == "find_nearby_hospitals" and isinstance(result.get("hospitals"), list):
                hospital_results.extend(item for item in result["hospitals"] if isinstance(item, dict))
        last = state["messages"][-1]
        response = last.content if isinstance(last, AIMessage) and isinstance(last.content, str) else "I’m sorry, I couldn’t generate a response."
        return {"final_response": response, "tools_used": tools_used, "sources": sources,
                "rag_context": rag_context, "hospital_results": hospital_results}

    async def invoke(self, query: str, chat_history: list[dict[str, str]], user_context: dict[str, Any]) -> dict[str, Any]:
        history_messages: list[BaseMessage] = []
        mapping = {"user": HumanMessage, "assistant": AIMessage, "system": SystemMessage}
        for item in chat_history:
            history_messages.append(mapping[item["role"]](content=item["content"]))
        context = json.dumps(user_context, default=str) if user_context else "No location or other user context supplied."
        messages = [SystemMessage(content=f"{SYSTEM_PROMPT}\n\nUser context: {context}"), *history_messages, HumanMessage(content=query)]
        try:
            result = await self.graph.ainvoke({"user_query": query, "chat_history": chat_history,
                                               "user_context": user_context, "messages": messages})
        except AgentExecutionError:
            raise
        except Exception as exc:
            raise AgentExecutionError("Agent workflow failed") from exc
        return result
