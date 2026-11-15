import json
import logging

from langchain_core.tools import tool
from pydantic import Field

from app.clients.hospital_client import HospitalClient
from app.exceptions import ExternalServiceError


logger = logging.getLogger(__name__)


def create_hospital_tool(client: HospitalClient):

    @tool
    async def find_nearby_hospitals(
        latitude: float = Field(
            description="User-provided latitude, between -90 and 90."
        ),
        longitude: float = Field(
            description="User-provided longitude, between -180 and 180."
        ),
        specialty: str | None = Field(
            default=None,
            description="Optional requested medical specialty."
        ),
    ) -> str:
        """Find nearby hospitals using MedNavigator's Hospital Service.
        Use only when valid user-provided coordinates are available.
        Never invent hospital facts or coordinates.
        """

        if not -90 <= latitude <= 90 or not -180 <= longitude <= 180:
            return json.dumps({
                "error": "Invalid location coordinates."
            })

        try:
            result = await client.find_nearby(
                latitude,
                longitude,
                specialty,
            )

            logger.info(
                "Hospital lookup succeeded: %s hospitals",
                len(result["hospitals"]),
            )

            return json.dumps(result)

        except ExternalServiceError:
            logger.exception("Hospital lookup failed")

            return json.dumps({
                "error": "Hospital search is currently unavailable."
            })

    return find_nearby_hospitals