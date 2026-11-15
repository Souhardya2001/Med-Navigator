# MedNavigator AI Agent Service

This service is the AI orchestration boundary for MedNavigator. It receives a query, prior chat messages, and optional user context from the Node.js Chat Service. It does not read the Chat Service database and never makes routing decisions in Chat Service.

## Architecture

`Chat Service -> AI Agent Service -> (RAG Service | Hospital Service) -> LLM -> Chat Service`

The FastAPI route validates the public request/response contract. `agent/graph.py` owns the LangGraph ReAct workflow and prompt execution. `tools/` exposes well-described LangChain tools; `clients/` performs only async HTTP calls and response validation; `config/` centralizes environment configuration; `models/` contains public Pydantic schemas. The system prompt is independently maintainable in `app/agent/prompts.py`.

## LangGraph flow

`START -> agent -> [tools if LLM requested one, otherwise finalize] -> agent -> finalize -> END`

The LLM receives the system prompt, user context, history, and current query. It chooses a tool by emitting a standard tool call. LangGraph executes that call, returns its result to the LLM, and only then accepts the final natural-language response. Finalization extracts tool/source metadata for the API without exposing internal graph messages.

## Setup and local run

1. Use Python 3.11+ and create/activate a virtual environment.
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and supply real values, especially `LLM_API_KEY` and the two service URLs.
4. Start: `uvicorn app.main:app --reload --port 8000`

Run tests without real model or service calls:

`pytest -q`

Run a container after providing configuration through the environment:

`docker build -t mednavigator-ai-agent .`

`docker run --rm -p 8000:8000 --env-file .env mednavigator-ai-agent`

## Environment variables

| Variable | Purpose |
| --- | --- |
| `LLM_PROVIDER` | Model provider (`openai` in this first version) |
| `LLM_MODEL`, `LLM_API_KEY`, `LLM_TIMEOUT` | Model selection, credential, and request timeout |
| `RAG_SERVICE_URL`, `RAG_SEARCH_PATH`, `RAG_SERVICE_TIMEOUT` | RAG HTTP endpoint and timeout |
| `HOSPITAL_SERVICE_URL`, `HOSPITAL_NEARBY_PATH`, `HOSPITAL_SERVICE_TIMEOUT` | Hospital HTTP endpoint and timeout |
| `APP_ENV` | Deployment environment label |

## API example

```bash
curl -X POST http://localhost:8000/agent/invoke \
  -H 'content-type: application/json' \
  -d '{
    "query":"Find a cardiologist-friendly hospital near me",
    "chat_history":[{"role":"user","content":"I have chest discomfort."}],
    "user_context":{"location":{"latitude":22.5726,"longitude":88.3639}}
  }'
```

Example response:

```json
{
  "response": "Here are hospitals returned by the service...",
  "tools_used": [{"name": "find_nearby_hospitals"}],
  "sources": []
}
```

## Tool decisions and Chat Service integration

The model—not query keyword code—chooses the RAG tool when grounded medical knowledge is needed and the Hospital tool for nearby/hospital-specific facts. Tool descriptions and the system prompt prohibit fabricated hospital data. If location is absent, the model asks for it; coordinates are also range-validated by Pydantic and the tool.

The future Node.js Chat Service should authenticate the caller, fetch/persist the conversation, and POST `{query, chat_history, user_context}` here. It receives `{response, tools_used, sources}`, persists/displays it, and must not call RAG or Hospital Service as part of deciding an AI response.
