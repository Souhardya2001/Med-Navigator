class ExternalServiceError(Exception):
    """A downstream dependency was unavailable or returned invalid data."""


class AgentExecutionError(Exception):
    """The agent could not produce a response."""
