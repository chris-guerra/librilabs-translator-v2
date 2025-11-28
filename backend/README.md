# Backend Setup Guide

## Security Validation

Before deploying, run the security validation script to ensure all security measures are in place:

```bash
./scripts/validate-security.sh
```

This script checks:
- `.env` is in `.gitignore`
- `.env.example` exists and doesn't contain actual keys
- No hardcoded API keys in source code
- Pre-commit hooks are configured
- CORS doesn't use wildcards
- Security documentation exists
- All security tests pass

## Local Development Setup

### Prerequisites

- Python 3.14 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Environment Setup

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your OpenAI API key (see OpenAI API Key Setup section below)

### Running the Application

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/integration/test_routers/test_health.py
```

## OpenAI API Key Setup

### Getting Your API Key

1. **Create an OpenAI Account:**
   - Visit https://platform.openai.com/
   - Sign up for an account or log in

2. **Generate API Key:**
   - Navigate to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "Librilabs Translator Dev")
   - Copy the key immediately (you won't be able to see it again)

3. **Configure in Project:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and set your API key:
     ```
     OPENAI_API_KEY=sk-your-actual-api-key-here
     ```

### Usage Limits and Rate Limits

- **Free Tier:** Limited requests per minute
- **Paid Tier:** Higher rate limits based on your plan
- **Rate Limits:** Check your usage dashboard at https://platform.openai.com/usage
- **Best Practice:** Implement retry logic with exponential backoff for production

### Security Best Practices

⚠️ **CRITICAL: Never commit API keys to version control**

1. **Environment Variables Only:**
   - Always use environment variables for API keys
   - Never hardcode keys in source code
   - Never log API key values (mask if referenced)

2. **Git Configuration:**
   - `.env` file is already in `.gitignore`
   - Verify `.env` is never committed:
     ```bash
     git check-ignore .env  # Should return: .env
     ```

3. **Pre-commit Hooks (REQUIRED):**
   Pre-commit hooks are configured to automatically detect and prevent secret commits.
   
   **Installation:**
   ```bash
   pip install pre-commit
   pre-commit install
   ```
   
   **Create secrets baseline (first time only):**
   ```bash
   pip install detect-secrets
   detect-secrets scan > .secrets.baseline
   git add .secrets.baseline
   ```
   
   **Verify hooks work:**
   ```bash
   pre-commit run --all-files
   ```
   
   The hooks will automatically:
   - Detect private keys, AWS credentials, and other secrets
   - Prevent commits containing secrets
   - Check for common security issues

4. **Production Deployment:**
   - Use secure secret management (Railway environment variables, AWS Secrets Manager, etc.)
   - Rotate keys regularly
   - Use different keys for development and production
   - See `SECURITY.md` for comprehensive security guidelines

### Troubleshooting

**Application fails to start if OPENAI_API_KEY is not set:**
- The application will log a warning but continue to run
- API key is only required when making OpenAI API calls (future stories)
- For now, you can run the application without the key for health check testing

## CORS Configuration

The application is configured with CORS middleware to allow requests from the frontend:

- **Development:** Allows `http://localhost:3000` (frontend dev server)
- **Production:** Must be configured with explicit allowed origins (never use `["*"]`)

**Production Configuration:**
- Set `ALLOWED_ORIGINS` environment variable with comma-separated origins
- Example: `ALLOWED_ORIGINS=https://app.librilabs.com,https://www.librilabs.com`
- Never use `allow_origins=["*"]` in production for security reasons
- Update `backend/app/main.py` to read from environment variable:
  ```python
  import os
  allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
  app.add_middleware(
      CORSMiddleware,
      allow_origins=allowed_origins,
      ...
  )
  ```

**Security:** See `SECURITY.md` for detailed CORS security guidelines

## Testing Infrastructure

This document describes the testing setup for the backend application.

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

