
## Live Deployment (v1.0)

**Backend API:** https://sentry-production-3579.up.railway.app
**Database:** Neon PostgreSQL (genuinely free)
**Live API Docs:** https://sentry-production-3579.up.railway.app/docs

### Stack Decision
- Railway: Free tier + $5 monthly credit, 24/7 uptime (doesn't sleep)
- Neon: Genuinely free PostgreSQL (never expires)
- React + Vite: Fast frontend deployment-ready


## 🚀 Live Deployment - v1.0 Complete

**Frontend:** https://sentry-lilac-pi.vercel.app
**Backend API:** https://sentry-production-3579.up.railway.app
**API Docs:** https://sentry-production-3579.up.railway.app/docs
**Database:** Neon PostgreSQL

### Stack
- **Frontend:** React 18 + Vite (Vercel)
- **Backend:** FastAPI (Railway)
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT + Argon2

### Deployment Decisions
✅ **Neon:** Genuinely free PostgreSQL (never expires)
✅ **Railway:** 24/7 uptime + $5/month credit (doesn't sleep)
✅ **Vercel:** Free frontend hosting with auto-deployments
✅ **Secrets:** All in environment variables (never in code)

### How to Use
1. Open frontend URL
2. Register or login
3. Create and manage incidents
4. All data persists in live database
5. Works 24/7 on any device

