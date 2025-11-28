# Monitoring and Observability

Monitoring strategy for fullstack application.

## Monitoring Stack

- **Frontend Monitoring:** Railway built-in metrics, browser console error tracking
- **Backend Monitoring:** Railway application metrics, Python logging
- **Error Tracking:** TBD post-MVP (Sentry, Datadog, or similar)
- **Performance Monitoring:** Railway performance metrics, custom logging for translation times

## Key Metrics

**Frontend Metrics:**
- Core Web Vitals (LCP, FID, CLS)
- JavaScript errors
- API response times
- User interactions (page views, button clicks)

**Backend Metrics:**
- Request rate
- Error rate
- Response time (p50, p95, p99)
- Database query performance
- Translation processing time
- OpenAI API usage and costs

## Logging

**Frontend Logging:**
- Console logging for development
- Error boundaries capture React errors
- API errors logged via TanStack Query

**Backend Logging:**
- Python standard logging library
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Railway log aggregation and viewing

---
