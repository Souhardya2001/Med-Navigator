# MedNavigator Hospital Service

This repository also contains the separate React client in [`frontend`](frontend/README.md). It communicates with the public API layer only; it does not call this Hospital Service from the browser.

Hospital Service is a stateless adapter and does not persist hospital data. It validates structured nearby-search requests, calls a configured hospital/place provider, and returns a stable normalized contract. It has no database, cache, LLM, or medical-reasoning responsibility.

```
AI Agent Service
       |
       | Hospital Tool
       v
Hospital Service
       |
       | HTTP
       v
External Hospital/Places API
```

The Agent Service depends on the Hospital Service contract rather than directly depending on the external provider. This isolates provider request and response formats, so a provider can later be replaced without changing the Agent Service or Hospital Tool.

## Run locally

Copy `.env.example` to `.env`, configure `EXTERNAL_HOSPITAL_API_URL` (and its key if needed), then run `npm install` and `npm start`. `docker compose up --build` starts only this service.

The provider adapter sends `latitude`, `longitude`, `radius` (kilometres), and optional `specialty` as query parameters. It optionally sends `EXTERNAL_HOSPITAL_API_KEY` in the `x-api-key` header. Provider-specific request/authentication changes belong only in `src/providers/hospital.provider.js`.

## API

`GET /hospitals/nearby?latitude=22.5726&longitude=88.3639&radius=10&specialty=cardiology`

`latitude` (-90 to 90) and `longitude` (-180 to 180) are required. `radius` is optional, defaults to `DEFAULT_SEARCH_RADIUS_KM`, and may not exceed `MAX_SEARCH_RADIUS_KM`. `specialty` is optional and limited to 100 trimmed characters.

Successful results use this provider-independent contract; unavailable fields are omitted.

```json
{
  "hospitals": [{
    "id": "provider-id",
    "name": "Example Hospital",
    "address": "123 Main Street, Kolkata",
    "location": { "latitude": 22.5726, "longitude": 88.3639 },
    "distance": 2.4,
    "phone": "+91XXXXXXXXXX",
    "website": "https://example.com",
    "specialties": ["Cardiology"]
  }]
}
```

Empty searches return `{ "hospitals": [] }`. `GET /health` returns `{ "status": "ok" }` and does not call the provider.

Errors have the shape `{ "error": { "code", "message" } }`: invalid parameters return `400 INVALID_REQUEST`; provider timeouts return `504 HOSPITAL_PROVIDER_TIMEOUT`; upstream/malformed provider responses return `502`; provider rate limiting returns `429 HOSPITAL_PROVIDER_RATE_LIMITED`. Provider details and credentials are never returned.

## Configuration

See `.env.example` for `PORT`, `EXTERNAL_HOSPITAL_API_URL`, `EXTERNAL_HOSPITAL_API_KEY`, `EXTERNAL_HOSPITAL_API_TIMEOUT`, `DEFAULT_SEARCH_RADIUS_KM`, `MAX_SEARCH_RADIUS_KM`, and `NODE_ENV`. Do not commit credentials.

## Testing

Run `npm test` and `npm run lint`. Tests mock the provider HTTP client, so they never call a real external API.
