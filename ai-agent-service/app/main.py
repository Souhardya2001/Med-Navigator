from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.agent.graph import MedNavigatorAgent
from app.agent.llm import create_llm
from app.api.routes.agent import router as agent_router
from app.clients.hospital_client import HospitalClient
from app.clients.rag_client import RagClient
from app.config.settings import Settings, get_settings
from app.tools.hospital_tool import create_hospital_tool
from app.tools.rag_tool import create_rag_tool


def build_agent(settings: Settings) -> MedNavigatorAgent:
    rag_client = RagClient(str(settings.rag_service_url), settings.rag_search_path, settings.rag_service_timeout)
    hospital_client = HospitalClient(str(settings.hospital_service_url), settings.hospital_nearby_path,
                                     settings.hospital_service_timeout)
    return MedNavigatorAgent(create_llm(settings), [create_rag_tool(rag_client), create_hospital_tool(hospital_client)])


def create_app(settings: Settings | None = None, agent: MedNavigatorAgent | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.agent = agent or build_agent(resolved_settings)
        yield

    app = FastAPI(title="MedNavigator AI Agent Service", version="0.1.0", lifespan=lifespan)
    app.include_router(agent_router)

    @app.get("/health", tags=["health"])
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
