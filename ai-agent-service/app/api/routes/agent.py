from fastapi import APIRouter, HTTPException, Request, status

from app.exceptions import AgentExecutionError
from app.models.requests import AgentInvokeRequest
from app.models.responses import AgentInvokeResponse

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/invoke", response_model=AgentInvokeResponse)
async def invoke_agent(payload: AgentInvokeRequest, request: Request) -> AgentInvokeResponse:
    agent = request.app.state.agent
    try:
        result = await agent.invoke(
            query=payload.query,
            chat_history=[message.model_dump() for message in payload.chat_history],
            user_context=payload.user_context.model_dump() if payload.user_context else {},
        )
    except AgentExecutionError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail="The AI service is temporarily unavailable.") from exc
    return AgentInvokeResponse(
        response=result["final_response"],
        tools_used=result.get("tools_used", []),
        sources=result.get("sources", []),
    )
