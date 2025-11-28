# Testing Strategy

Comprehensive testing approach for fullstack application.

## Testing Pyramid

```
        E2E Tests
       /        \
   Integration Tests
   /            \
Frontend Unit  Backend Unit
```

## Test Organization

**Frontend Tests:**
```
frontend/tests/
├── unit/
│   └── components/
├── integration/
│   └── api/
└── e2e/
    └── workflows/
```

**Backend Tests:**
```
backend/tests/
├── unit/
│   ├── test_services/
│   └── test_models/
└── integration/
    └── test_routers/
```

**E2E Tests:**
```
tests/e2e/
├── upload-workflow.spec.ts
├── translation-workflow.spec.ts
└── editing-workflow.spec.ts
```

## Test Examples

**Frontend Component Test:**
```typescript
// frontend/tests/unit/components/DocumentUpload.test.tsx
import { render, screen } from '@testing-library/react';
import { DocumentUpload } from '@/components/document/DocumentUpload';

describe('DocumentUpload', () => {
  it('validates file format', () => {
    render(<DocumentUpload onUploadSuccess={jest.fn()} />);
    // Test implementation
  });
});
```

**Backend API Test:**
```python
# backend/tests/integration/test_routers/test_documents.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_upload_document():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/documents/upload",
            files={"file": ("test.txt", b"content", "text/plain")},
            data={"source_language": "en"}
        )
        assert response.status_code == 201
```

**E2E Test:**
```typescript
// tests/e2e/translation-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete translation workflow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Upload document
  // Start translation
  // Wait for completion
  // Verify side-by-side view
  // Edit translation
  // Download
});
```

## Accessibility Testing

**Tools:**
- **axe-core:** Automated accessibility testing library integrated into Playwright tests
- **WAVE (Web Accessibility Evaluation Tool):** Browser extension for manual accessibility audits
- **Lighthouse:** Built into Chrome DevTools for accessibility scoring
- **Screen Reader Testing:** NVDA (Windows) or VoiceOver (macOS) for manual testing

**Accessibility Testing Approach:**
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});

test('keyboard navigation works', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test Tab navigation
  await page.keyboard.press('Tab');
  // Verify focus indicators
  // Test Enter/Space for interactions
});
```

**Accessibility Testing Checklist:**
- **Automated:** axe-core integrated into CI/CD pipeline
- **Manual:** Keyboard navigation, screen reader testing
- **Compliance Target:** WCAG AA level
- **Testing Frequency:** Pre-commit hooks for critical violations, full audit before releases

---
