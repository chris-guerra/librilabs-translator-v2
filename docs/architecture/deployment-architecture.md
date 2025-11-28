# Deployment Architecture

Deployment strategy based on Railway platform choice.

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Railway
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **CDN/Edge:** Railway's global CDN for static assets

**Backend Deployment:**
- **Platform:** Railway
- **Build Command:** Docker build (Python 3.14, install dependencies)
- **Deployment Method:** Docker container with Railway
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main, development]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run frontend tests
        run: npm run test --workspace=frontend
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.14'
      - name: Install backend dependencies
        run: cd backend && pip install -r requirements.txt
      - name: Run backend tests
        run: cd backend && pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:8000 | Local development |
| Staging | https://staging.librilabs-translator.railway.app | https://api-staging.librilabs-translator.railway.app | Pre-production testing |
| Production | https://librilabs-translator.railway.app | https://api.librilabs-translator.railway.app | Live environment |

---
