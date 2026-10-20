# Cloudflare Deployment Guide — Bizele Waitlist

This guide walks you through deploying both the **frontend** and **backend** of the Bizele waitlist platform to Cloudflare.

---

## Architecture Options

| Strategy | Frontend | Backend | Best For |
|---|---|---|---|
| **Option 1 (Recommended)** | **Cloudflare Pages** | **Cloudflare Pages Functions** (Edge API) | **Zero-server, 100% Cloudflare serverless**. Free tier, instant edge response, no Docker or Python process to maintain. |
| **Option 2 (Hybrid)** | **Cloudflare Pages** | **FastAPI Python (VPS/Container) via Cloudflare Tunnel / DNS** | When you want to keep and run the exact Python `backend/main.py` container. |

---

## Option 1: 100% Cloudflare Pages + Edge Functions (Recommended)

In this approach, Cloudflare Pages hosts the static React application, and Cloudflare Pages Functions (`frontend/functions/api/`) execute the backend endpoints (`/api/waitlist` and `/api/waitlist/count`) directly on Cloudflare's global edge network, communicating securely with Supabase.

### Step 1: Push Code to GitHub / GitLab
Ensure your latest changes are pushed to your Git repository:
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin master
```

### Step 2: Create a Cloudflare Pages Project
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, navigate to **Compute (Workers) > Workers & Pages**.
3. Click **Create Application** > select the **Pages** tab > click **Connect to Git**.
4. Choose your GitHub repository (`Bizele-Waitlist`).

### Step 3: Configure Build Settings
Fill in the deployment configuration:
- **Project name**: `bizele` (or your preferred name)
- **Production branch**: `master` (or `main`)
- **Framework preset**: `Vite`
- **Root directory**: `frontend`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### Step 4: Add Environment Variables
Under **Environment variables (advanced)**, add:
- `SUPABASE_URL`: Your Supabase Project URL (e.g. `https://xyzcompany.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret key (for server-side inserts)
- `NODE_VERSION`: `20`

Click **Save and Deploy**.

### Step 5: What Happens Automatically
- Cloudflare builds the Vite bundle to `dist/`.
- The `frontend/public/_redirects` rule (`/* /index.html 200`) is copied into `dist/`, ensuring SPA routes (`/privacy-policy`, `/terms-and-conditions`, `/cookie-policy`) never 404 on direct refresh.
- The `frontend/functions/api/` folder is automatically compiled into edge functions handling:
  - `GET /api/waitlist/count`
  - `POST /api/waitlist`
- Everything runs on the exact same origin, meaning **zero CORS configuration needed**!

---

## Option 2: Cloudflare Pages (Frontend) + Python FastAPI (Backend)

If you prefer to run the Python FastAPI service (`backend/main.py`):

### 1. Deploy the FastAPI Backend
Deploy `backend/` to any container or cloud provider (e.g., Render, Railway, Fly.io, or an Ubuntu VPS).

**Example: Render / Railway**
- **Root directory**: `backend`
- **Build command**: `pip install -r requirements.txt`
- **Start command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment variables**:
  - `SUPABASE_URL`: `https://your-project.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY`: `your_service_role_key`
  - `FRONTEND_URL`: `https://bizele.pages.dev` (or your custom domain `https://bizele.com`)

### 2. Route Backend Through Cloudflare (Custom Domain / Tunnel)
If using your own domain (e.g. `api.bizele.com`):
1. In Cloudflare DNS, add a `CNAME` record for `api` pointing to your backend host with **Proxy status enabled (Orange Cloud)**.
2. Alternatively, use a **Cloudflare Tunnel (`cloudflared`)** for zero-open-port security directly to your VPS.

### 3. Deploy Frontend on Cloudflare Pages
Follow Steps 1–3 from Option 1 above, then:
- In Cloudflare Pages project settings, add the environment variable:
  - `VITE_API_URL`: `https://api.bizele.com` (or your backend URL)
- Trigger a redeploy. The frontend client will route all API calls to your FastAPI backend.

---

## Custom Domain Setup

1. In Cloudflare Pages, go to **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter your domain (e.g., `bizele.com` or `waitlist.bizele.com`).
4. Cloudflare automatically generates SSL certificates and configures DNS routing.

---

## Verification Checklist

After deployment:
- [ ] Visit `https://your-project.pages.dev` — role selector and landing page load.
- [ ] Visit `https://your-project.pages.dev/privacy-policy` directly in a new tab — verify it renders without 404 error.
- [ ] Test the cookie banner: Click **Customize**, toggle preferences, click **Save Preferences**.
- [ ] Test waitlist submission: Submit a test email and verify it appears in your Supabase `waitlist` table.
- [ ] Check waitlist live odometer count updates.
