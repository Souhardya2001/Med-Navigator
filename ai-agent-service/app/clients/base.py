from typing import Any
import httpx
import logging
from app.exceptions import ExternalServiceError
logger = logging.getLogger(__name__)

class BaseServiceClient:
    def __init__(self, base_url: str, timeout: float) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def _post(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient(base_url=self.base_url, timeout=self.timeout) as client:
                response = await client.post(path, json=payload)
                response.raise_for_status()
                body = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise ExternalServiceError("Downstream service request failed") from exc
        if not isinstance(body, dict):
            raise ExternalServiceError("Downstream service returned an invalid response")
        return body

    async def _get(
        self,
        path: str,
        params: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        try:
            async with httpx.AsyncClient(
                base_url=self.base_url,
                timeout=self.timeout,
            ) as client:
                response = await client.get(path, params=params)
                response.raise_for_status()
                body = response.json()

        except httpx.HTTPStatusError as exc:
                logger.error(
                    "Downstream GET failed: status=%s url=%s response=%s",
                      exc.response.status_code,
                      exc.request.url,
                      exc.response.text[:1000],
                    )

                raise ExternalServiceError(
                  "Downstream service request failed"
                  ) from exc

        except (httpx.RequestError, ValueError) as exc:
                 logger.exception("Downstream GET request failed")

                 raise ExternalServiceError(
                       "Downstream service request failed"
                ) from exc

        if not isinstance(body, dict):
            raise ExternalServiceError(
                "Downstream service returned an invalid response"
            )

        return body