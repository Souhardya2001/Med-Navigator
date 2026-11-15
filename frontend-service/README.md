# MedNavigator Frontend

A responsive React interface for MedNavigator, an AI-powered healthcare navigation assistant. It presents healthcare information and routes user actions to the public backend APIs; it contains no medical reasoning, retrieval, or hospital-provider logic.

## Stack and pages

- React, Vite, JavaScript, React Router, Tailwind CSS
- `/` landing page, `/login`, `/signup`, and protected `/chat`

Authentication calls are kept in `src/services/authApi.js`; chat calls live in `src/services/chatApi.js`. `AuthContext` holds the signed-in user and session token. The chat page creates, lists, reads, sends, and deletes conversations through the Chat Service API. Browser location is held in memory only for the current session and is sent only after the user grants permission.

## Backend boundary

```
React Frontend
      |
      v
API Gateway
      |
      v
Chat Service
      | +-- MongoDB
      | +-- Redis
      v
Agent Service
      | +-- RAG Service
      | +-- Hospital Service
```

The frontend does not directly communicate with the Agent Service, RAG Service, or Hospital Service.

## Local setup

1. `cd frontend`
2. Copy `.env.example` to `.env`. Set `VITE_AUTH_API_BASE_URL` and `VITE_CHAT_API_BASE_URL` to their respective public service origins. `VITE_API_BASE_URL` is only a fallback for a single API Gateway setup.
3. `npm install`
4. `npm run dev`

Run `npm run build` for a production build. The backend determines the precise auth response shape and endpoint paths; if its contract differs from the expected `/auth/*` and `/chats/*` endpoints, adjust only the two files in `src/services/`.
