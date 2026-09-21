## Deployment (v1.0)

**Database:** Neon (genuinely free, never expires)
**Host:** Railway (24/7 uptime, $5/month free credit)
**Live API:** https://sentry-api-xxxxx.up.railway.app
**Live Docs:** https://sentry-api-xxxxx.up.railway.app/docs

### Why These Choices?
- Neon: Free tier never expires (unlike Render's 90-day limit)
- Railway: Always on + free monthly credit (unlike Render/Fly free tiers that sleep)
- All secrets stored securely in Railway dashboard, never in code
- Database connection string encrypted in environment variables

### Deployment Architecture
1. Code pushed to GitHub
2. Railway auto-deploys from GitHub
3. Railway connects to Neon via secure environment variable
4. FastAPI creates tables automatically on startup
5. API accessible 24/7 at live URL