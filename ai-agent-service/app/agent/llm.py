from typing import Protocol, Sequence

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.tools import BaseTool
from langchain_openai import ChatOpenAI

from app.config.settings import Settings


class LlmFactory(Protocol):
    def create(self, settings: Settings) -> BaseChatModel: ...


def create_llm(settings: Settings) -> BaseChatModel:
    """Create a provider model. Add providers here without changing graph code."""
    if settings.llm_provider.lower() == "groq":
       return ChatOpenAI(
    model=settings.llm_model,
    api_key=settings.llm_api_key,
    base_url="https://api.groq.com/openai/v1",
    timeout=settings.llm_timeout,
    temperature=0,
   ) 
    raise ValueError(f"Unsupported LLM_PROVIDER: {settings.llm_provider}")


def bind_tools(llm: BaseChatModel, tools: Sequence[BaseTool]):
    return llm.bind_tools(list(tools))
