# Backend Setup Guide

## Testing Infrastructure

This document describes the testing setup for the backend application. The actual implementation of backend tests will be completed in Story 1.1.

### Testing Framework: Pytest

Pytest is the standard Python testing framework used for unit and integration testing.

#### Installation

```bash
pip install pytest pytest-asyncio
```

- `pytest`: Core testing framework
- `pytest-asyncio`: Required for testing async FastAPI endpoints

### API Testing: httpx

httpx is used as an async HTTP client for testing FastAPI endpoints.

#### Installation

```bash
pip install httpx
```

### Test Configuration

Create a `pytest.ini` file in the backend root directory:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
asyncio_mode = auto
```

Alternatively, configure in `pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
asyncio_mode = "auto"
```

### Test Structure

Backend tests should be organized as follows:

```
backend/tests/
├── unit/
│   ├── test_services/
│   └── test_models/
└── integration/
    └── test_routers/
```

### Example Test Structure

```python
# backend/tests/unit/test_services/example_test.py
import pytest
from app.services.example_service import ExampleService

def test_example_service_function():
    service = ExampleService()
    result = service.example_function()
    assert result is not None

# backend/tests/integration/test_routers/example_test.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_example_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/v1/example")
        assert response.status_code == 200
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_services/example_test.py

# Run with coverage
pytest --cov=app --cov-report=html
```

### Note

Backend testing implementation will be completed in Story 1.1. This document serves as a reference for the testing infrastructure setup.

