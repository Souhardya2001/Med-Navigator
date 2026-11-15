from typing import Any

from app.clients.base import BaseServiceClient
from app.exceptions import ExternalServiceError


class HospitalClient(BaseServiceClient):
    def __init__(
        self,
        base_url: str,
        path: str,
        timeout: float,
    ) -> None:
        super().__init__(base_url, timeout)
        self.path = path

    async def find_nearby(
        self,
        latitude: float,
        longitude: float,
        specialty: str | None = None,
    ) -> dict[str, Any]:

        params: dict[str, Any] = {
            "latitude": latitude,
            "longitude": longitude,
            "radius": 5,
        }

        if specialty:
            params["specialty"] = specialty

        body = await self._get(self.path, params=params)

        hospitals = body.get("hospitals", body.get("results"))

        if not isinstance(hospitals, list):
            raise ExternalServiceError(
                "Hospital service response has no hospital list"
            )

        if not all(isinstance(item, dict) for item in hospitals):
            raise ExternalServiceError(
                "Hospital service returned invalid hospital data"
            )

        return {"hospitals": hospitals}