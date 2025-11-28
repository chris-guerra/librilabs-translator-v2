"""
Pytest configuration and fixtures.

Provides FastAPI test client fixture for integration tests.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
async def client():
    """
    FastAPI test client fixture.
    
    Provides an async HTTP client for testing FastAPI endpoints.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

