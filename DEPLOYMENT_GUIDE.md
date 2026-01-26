# EduEquity OS - Deployment Guide

This guide covers deploying EduEquity OS to production with free or near-free hosting options.

## Overview

EduEquity OS is a monorepo with:
- **Frontend**: Next.js 14 (App Router) in `apps/web`
- **Backend**: FastAPI in `apps/api`
- **Proxy**: Next.js API routes forward to FastAPI

## Architecture

```
[User] → [Vercel - Frontend] → [Render/Fly.io - Backend API]
                         ↓
              [Next.js Proxy /api/v1/*]
                         ↓
              [FastAPI Backend]
```

## Prerequisites

1. GitHub account
2. Vercel account (free)
3. Render account (free tier) or Fly.io account

---

## Part 1: Deploy Backend (Render)

### Step 1: Prepare Repository

Ensure your repository is pushed to GitHub with:
- `apps/api/` directory
- `requirements.txt` in `apps/api/`
- `Dockerfile` in `apps/api/`

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| Name | `eduequity-api` |
| Region | Choose closest to you |
| Branch | `main` |
| Runtime | `Python 3` |
| Build Command | `pip install -r apps/api/requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### Step 3: Add Environment Variables

In Render, go to **Environment** tab and add:

```env
# Required
APP_ENV=production
APP_DEBUG=false
SECRET_KEY=your-super-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key

# Database (optional - uses SQLite by default)
# DATABASE_URL=postgresql://user:password@host/dbname

# CORS - Replace with your Vercel frontend URL
CORS_ORIGINS=https://your-frontend.vercel.app

# Cookie settings for production
PRODUCTION_DOMAIN=onrender.com
```

### Step 4: Deploy

Click **Create Web Service**. Render will:
1. Install dependencies
2. Run the FastAPI app on port `$PORT`
3. Provide a public URL like: `https://eduequity-api.onrender.com`

### Step 5: Verify Backend

Visit `https://your-backend-url/docs` to see the Swagger API documentation.

---

## Part 2: Deploy Frontend (Vercel)

### Step 1: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| Framework Preset | `Next.js` |
| Root Directory | `apps/web` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

### Step 2: Add Environment Variables

In Vercel, go to **Settings** → **Environment Variables** and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com
```

**Important**: Use the exact URL from your Render backend (without trailing slash).

### Step 3: Deploy

Click **Deploy**. Vercel will build and deploy your frontend.

### Step 4: Configure CORS on Backend

After frontend deployment, update Render environment variable:

```env
CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

Then restart your Render service.

---

## Part 3: Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/eduequity-os.git
cd eduequity-os

# Install root dependencies
npm install

# Install web dependencies
cd apps/web && npm install

# Return to root
cd ../..

# Run both frontend and backend
npm run dev
```

### Run Separately

```bash
# Terminal 1 - Backend (port 8000)
cd apps/api
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend (port 3000)
cd apps/web
npm run dev
```

### Access Local Development

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Part 4: Configuration Guide

### Environment Variables

#### Backend (apps/api/.env or Render)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_ENV` | No | `development` | Set to `production` for production |
| `APP_DEBUG` | No | `True` | Set to `false` in production |
| `SECRET_KEY` | Yes | - | Secret key for encryption |
| `JWT_SECRET_KEY` | Yes | - | JWT signing secret |
| `DATABASE_URL` | No | SQLite | PostgreSQL connection string |
| `CORS_ORIGINS` | No | - | Comma-separated allowed origins |
| `PORT` | No | `8000` | Port for the server |

#### Frontend (apps/web/.env.local or Vercel)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:8000` | Backend API URL |

### Cookie Settings

For production deployment, cookies are configured based on `APP_ENV`:
- **Development**: `SameSite=Lax`, `Secure=false`
- **Production**: `SameSite=None`, `Secure=true`

---

## Part 5: Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure `CORS_ORIGINS` on backend includes your frontend URL
2. Verify `NEXT_PUBLIC_API_URL` on frontend matches backend URL
3. Check that both frontend and backend use HTTPS in production

### Authentication Issues

If login/register doesn't work:

1. Check browser cookies are enabled (httpOnly cookies are used)
2. Verify `CORS_ALLOW_CREDENTIALS=true` on backend
3. Ensure both frontend and backend URLs are in CORS origins

### Database Issues

If using SQLite (default):
- Database file: `apps/api/eduequity.db`
- Data persists in container but may be lost on redeploy

For persistent data:
- Use PostgreSQL on Render (free tier includes 1GB database)
- Set `DATABASE_URL` environment variable

### Build Failures

If frontend build fails:
```bash
cd apps/web
npm run build
```

Check for TypeScript errors:
```bash
cd apps/web
npm run type-check
```

---

## Part 6: Production Checklist

Before going live:

- [ ] Backend deployed and accessible at public URL
- [ ] Frontend deployed and accessible at public URL
- [ ] Environment variables set on both platforms
- [ ] CORS configured correctly (backend origin in frontend env)
- [ ] API health check working: `https://api.domain.com/health`
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Dashboard loading correctly
- [ ] No console errors

---

## Part 7: Free Tier Limits

### Render Free Tier
- 750 hours/month web service
- Sleeps after 15 min of inactivity
- Limited to one free web service

### Vercel Free Tier
- 100GB bandwidth/month
- Unlimited deployments
- Custom domain support

### Fly.io Free Tier
- 3 shared VMs
- 3GB persistent volume storage

---

## Part 8: Custom Domain (Optional)

### Vercel Frontend
1. Go to Vercel project settings
2. Click **Domains**
3. Add your custom domain
4. Update DNS records as instructed

### Render Backend
1. Go to Render service settings
2. Click **Custom Domain**
3. Add your domain
4. Update DNS records

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Run both frontend and backend
cd apps/web && npm run dev  # Frontend only
cd apps/api && python -m uvicorn app.main:app --reload  # Backend only

# Build
cd apps/web && npm run build

# Type checking
cd apps/web && npm run type-check

# Linting
cd apps/web && npm run lint
cd apps/web && npm run lint:fix

# Test
cd apps/web && npm run test
```

---

## Support

- **Issues**: Open a GitHub issue
- **Documentation**: Check `/docs` folder
- **API Docs**: Visit `/docs` on your deployed backend

---

## License

MIT License - feel free to use for personal or commercial projects.

