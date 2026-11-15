# MedNavigator Chat Service

An Express.js service that owns authenticated chat sessions, durable messages, and the API boundary to MedNavigator's AI Agent Service. It does not make LLM, RAG, Hospital Service, LangChain, or LangGraph calls.

```
Frontend -> Chat Service -> Agent Service -> LLM / RAG / Hospital Service
                |   |
             MongoDB Redis
```

MongoDB is the source of truth. Redis caches recent conversation context (the latest `CHAT_CONTEXT_LIMIT`, default 20) using `chat:{chatId}:recent_messages`. Cache reads are cache-aside: Redis is checked first, then MongoDB fills a miss. Writes invalidate the key after MongoDB succeeds, which is simpler and race-safe; Redis errors are logged and never fail a chat request.

## Run

Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, then run `npm install` and `npm start`. `docker compose up --build` starts this service, MongoDB, and Redis; configure `AGENT_SERVICE_URL` to reach the separately deployed Agent Service.

## API

All `/chats` endpoints require `Authorization: Bearer <JWT>` with `id`, `userId`, or `sub` as the user identifier.

- `POST /chats` — create (`title` optional)
- `GET /chats?limit=20&offset=0` — list caller's chats
- `GET /chats/:chatId` — get an owned chat
- `DELETE /chats/:chatId` — delete an owned chat and its messages
- `GET /chats/:chatId/messages?limit=50&before=<messageId>` — chronological history page
- `POST /chats/:chatId/messages` — persist a user message, send prior context plus optional `user_context` to `POST /agent/invoke`, and persist the assistant result
- `GET /health` — service liveness

Responses use `{ "data": ... }`; errors use `{ "error": { "code", "message" } }`. Unknown or unowned chats both return 404. The Agent client validates its public contract and maps `response`, `tools_used`, and `sources` to the assistant message's content and metadata.

## Data model and failure behavior

`Chat` has `userId`, `title`, `lastMessageAt`, timestamps, and a `{ userId, updatedAt }` index. `Message` has `chatId`, `userId`, role, content, status, flexible metadata, timestamps, and `{ chatId, createdAt }` for history/context queries.

User messages remain durable if the Agent Service times out or fails. Such failures return a safe 5xx response. Idempotency is intentionally not implemented yet; orchestration is contained in `chat.service.js` so an `Idempotency-Key` store can be added without rewriting controllers or repositories.

## Configuration

See `.env.example`: `PORT`, `MONGODB_URI`, `REDIS_URL`, `AGENT_SERVICE_URL`, `AGENT_INVOKE_PATH`, `AGENT_SERVICE_TIMEOUT`, `CHAT_CONTEXT_LIMIT`, `JWT_SECRET`, and `NODE_ENV`.

## Testing

Run `npm test`. Tests should mock repositories, cache, and the Agent client; they never need a live Agent Service. Run `npm run lint` for static checks.
