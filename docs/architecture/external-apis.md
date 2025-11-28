# External APIs

The system integrates with external APIs for translation processing and authentication. This section documents the external services, their integration points, and security considerations.

## OpenAI API

**Purpose:** Primary translation engine for document translation. Provides LLM-based translation with quality optimization through the translation service module.

**Documentation:** https://platform.openai.com/docs/api-reference

**Base URL(s):** 
- `https://api.openai.com/v1/chat/completions` (Chat Completions API)

**Authentication:** 
- API Key authentication via `Authorization: Bearer {api_key}` header
- API key stored as environment variable `OPENAI_API_KEY` (Railway secrets)

**Rate Limits:**
- Tier-based rate limits based on OpenAI account tier
- Default tier: ~3,500 requests/minute, ~90,000 tokens/minute
- Rate limit headers included in responses: `x-ratelimit-limit-requests`, `x-ratelimit-remaining-requests`
- Implementation includes exponential backoff retry logic for rate limit handling

**Key Endpoints Used:**
- `POST /v1/chat/completions` - Main translation endpoint
  - Model: `gpt-4` or `gpt-4-turbo` (to be determined based on quality/cost trade-off)
  - Request includes: source text, source language, target language, translation instructions
  - Response: Translated text with quality optimization

**Integration Notes:**
- **Chunking Strategy:** Long documents are chunked into segments (max ~50,000 characters per chunk) to stay within token limits
- **Progress Tracking:** Translation progress is tracked per chunk and aggregated to overall percentage
- **Error Handling:** Implements retry logic with exponential backoff for transient failures
- **Rate Limit Handling:** Service implements comprehensive rate limit handling:
  - Respects rate limits by monitoring `x-ratelimit-remaining-requests` headers
  - Implements exponential backoff retry logic for rate limit responses
  - Handles 429 (Too Many Requests) responses with appropriate backoff delays
  - Includes rate limit monitoring and logging to track API usage and prevent quota exhaustion
  - Logs rate limit events for debugging and cost optimization
- **Cost Management:** Token usage is tracked and logged for cost monitoring
- **Quality Optimization:** Translation service includes additional logic beyond basic API calls for quality improvement (context preservation, terminology consistency)
- **Async Processing:** Translation processing happens asynchronously to avoid blocking API requests
- **Security:** API key is never exposed to frontend, all calls made server-side
- **Offline Development Mode:** For local development when OpenAI API is unavailable:
  - Set environment variable `USE_MOCK_OPENAI=true` in backend/.env
  - Translation service uses mock responses instead of real API calls
  - Mock responses return deterministic translations: "Translated: {original_text}" pattern
  - Preserves paragraph structure, chunking behavior, and API response format
  - Allows full workflow testing without API costs or rate limits
  - Production deployments enforce `USE_MOCK_OPENAI=false` or unset (environment check)
  - Mock mode is disabled in production/staging environments for safety

## Resend API (Post-MVP)

**Purpose:** Email delivery service for authentication codes and magic links. Used for user authentication flow post-MVP.

**Documentation:** https://resend.com/docs

**Base URL(s):**
- `https://api.resend.com/emails` (Email sending)

**Authentication:**
- API Key authentication via `Authorization: Bearer {api_key}` header
- API key stored as environment variable `RESEND_API_KEY` (Railway secrets)

**Rate Limits:**
- Free tier: 3,000 emails/month, 100 emails/day
- Paid tiers: Higher limits based on plan
- Rate limit information in response headers

**Key Endpoints Used:**
- `POST /emails` - Send email
  - Request includes: recipient email, subject, HTML/text content
  - Response: Email ID for tracking
  - Used for: Authentication code delivery, magic link delivery

**Integration Notes:**
- **Email Templates:** Authentication emails use HTML templates with branding
- **Code Generation:** FastAPI generates secure random codes (6-8 digits) or magic link tokens
- **Expiration:** Authentication codes expire after 15 minutes (configurable)
- **Security:** Magic links include secure tokens that expire after single use or time limit
- **Error Handling:** Failed email deliveries are logged and user-friendly error messages displayed
- **Post-MVP Only:** This integration is designed but not implemented during MVP

**Rationale for External APIs:**

**Design Decisions:**
1. **OpenAI for Translation:** Provides high-quality LLM-based translation with flexibility for quality optimization
2. **Resend for Email:** Simple, developer-friendly email API with good deliverability for authentication emails
3. **Server-Side Integration:** All external API calls made server-side to protect API keys and reduce frontend complexity
4. **Retry Logic:** Both integrations include retry mechanisms for reliability
5. **Rate Limit Handling:** Proper rate limit detection and backoff strategies prevent service disruption

**Security Considerations:**
- **API Key Management:** All API keys stored as Railway environment variables/secrets, never in code
- **No Frontend Exposure:** External API keys never exposed to frontend clients
- **Request Validation:** All external API requests include input validation before sending
- **Error Sanitization:** External API errors are sanitized before returning to frontend (no sensitive information leaked)

**Cost Considerations:**
- **OpenAI:** Token-based pricing. Cost scales with document size and translation volume
- **Resend:** Free tier sufficient for MVP testing, paid tier needed for production scale
- **Monitoring:** Token usage and email sending tracked for cost optimization

---
