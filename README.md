# Bizele — Dynamic AI-First Pre-Launch Waitlist

> **The smarter way to connect brands with influence.** AI-powered matching that helps brands discover authentic creators and creators land high-ROI, escrow-backed sponsorship deals.

![Bizele](frontend/public/logo.png)

---

## Overview

Bizele is an intelligent, two-sided marketplace designed for the modern creator economy. This repository contains the **high-converting, motion-driven pre-launch waitlist platform** built with a robust, production-ready full-stack architecture:

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS design system (zero heavy CSS dependencies), and custom physics/canvas motion engines.
- **Backend**: FastAPI (Python 3.12+), Pydantic v2 data validation, CORS protection, and async handlers.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) / Local SQLite fallback with aggregate counter tracking and duplicate prevention.
- **Compliance & Privacy**: Cookie consent banner with granular preferences (Essential, Analytics, Marketing) and legal documentation suite.

---

## Key Features

### 1. Interactive Role Selector & Dual Experiences
- **Immersive Entry**: Visitors choose between **Creator** or **Business** on initial load with smooth ambient gradient shifts.
- **Tailored Views**:
  - **Creator Screen**: Highlights audience synchronization (TikTok, Instagram, YouTube), live media kits, fair benchmark deal rates, and upfront escrow guarantees.
  - **Business Screen**: Highlights omnichannel campaign telemetry, verified impressions, blended ROAS tracking, and bot traffic fraud filtering.
- **Seamless Role Switching**: One-click switch in the navigation header persists user role in `sessionStorage`.

### 2. AI-Powered Matching & Telemetry
- **Interactive Match Simulation (`AIMatchAnimation`)**: Visualizes real-time creator-brand compatibility scoring, niche verification, and automated deal contract workflows.
- **Real-Time Live Counter Odometer**: Smooth rolling count-up odometer reflecting actual database waitlist registrations (zero simulated numbers).
- **Physics-Driven CTAs**: Magnetic attraction with hover glow and micro-bounce on click (auto-disabled on touch and reduced-motion devices).

### 3. Granular Cookie Consent System
- **Compliant Cookie Banner**: Minimal, non-intrusive banner matching Bizele's brand aesthetic (`#7B3260` / `#C86A86`).
- **Granular Controls**:
  - **Accept All**: Enables all cookies.
  - **Reject Optional**: Keeps only strictly necessary cookies.
  - **Customize Modal**: Toggle switches for **Essential** (locked always-on), **Analytics**, and **Marketing** cookies.
- **Persistence**: Preferences saved to `localStorage` (`bizele_cookie_consent`).
- **Always Accessible**: Re-openable at any time via the footer "Cookie Settings" button or directly from the Cookie Policy page.

### 4. Legal Documentation Suite & Client Routing
- Dedicated legal pages with draft disclaimers and structured placeholders for corporate details:
  - **Privacy Policy** (`/privacy-policy` or `#/privacy-policy`)
  - **Terms & Conditions** (`/terms-and-conditions` or `#/terms-and-conditions`)
  - **Cookie Policy** (`/cookie-policy` or `#/cookie-policy`)
- Responsive [LegalPage](frontend/src/components/LegalPage.tsx) layout with sticky back navigation ("Back to Bizele") and direct client-side routing.

### 5. Production Waitlist Modal
- Dual-role registration form (Creator / Brand) with real-time field validation.
- Server-side email validation, duplicate entry prevention, and clear loading/success/error feedback.
- Accessible keyboard navigation with `Escape` closing and backdrop dismissal.

---

## Project Structure

```
Bizele-Waitlist/
├── assets/                   # Brand assets and legal drafts
├── backend/
│   ├── main.py               # FastAPI application, database logic & endpoints
│   ├── requirements.txt      # Python dependencies (FastAPI, Uvicorn, Supabase, etc.)
│   ├── .env.example          # Environment variables template
│   └── .gitignore            # Backend ignore rules
├── frontend/
│   ├── src/
│   │   ├── components/       # UI Components:
│   │   │   ├── AIMatchAnimation.tsx    # Interactive AI matching simulation
│   │   │   ├── BusinessScreen.tsx      # Business landing experience
│   │   │   ├── CookieBanner.tsx        # GDPR/ePrivacy cookie banner & preferences
│   │   │   ├── CreatorScreen.tsx       # Creator landing experience
│   │   │   ├── CounterOdometer.tsx     # Rolling waitlist counter
│   │   │   ├── FinalCTA.tsx            # Bottom conversion section
│   │   │   ├── Footer.tsx              # Site footer with legal links & cookie settings
│   │   │   ├── Hero.tsx / HeroCanvas.tsx # Animated network background canvas
│   │   │   ├── HowItWorks.tsx          # 4-stage platform workflow
│   │   │   ├── LegalPage.tsx           # Shared legal layout wrapper
│   │   │   ├── Navbar.tsx              # Header navigation & role switcher
│   │   │   ├── RoleSelector.tsx        # Initial role selection entrance
│   │   │   └── WaitlistModal.tsx       # Registration modal dialog
│   │   ├── config/           # Configuration helpers (roleConfig.ts)
│   │   ├── context/          # React contexts (RoleContext, CookieConsentContext)
│   │   ├── hooks/            # Custom hooks (useWaitlist, useMagnetic)
│   │   ├── lib/              # API fetch client
│   │   ├── pages/            # Legal pages (PrivacyPolicy, Terms, CookiePolicy)
│   │   ├── types/            # TypeScript interfaces & types
│   │   ├── App.tsx           # Main application shell & routing
│   │   ├── index.css         # Core design tokens, typography, and utility classes
│   │   └── main.tsx          # React root with providers
│   ├── package.json          # Node dependencies & build scripts
│   ├── vite.config.ts        # Vite configuration & dev proxy
│   └── .gitignore            # Frontend ignore rules
├── docs/                     # Specifications: PRODUCT, BRAND, UX-DESIGN, API, DATABASE
├── setup.md                  # Comprehensive local setup guide
├── .gitignore                # Root workspace ignore rules
└── README.md                 # Project documentation
```

---

## Quick Start

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: v3.11+ (v3.12 recommended)
- **Package Managers**: `npm` and `pip`

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional: Supabase credentials or local SQLite fallback)
cp .env.example .env

# Run FastAPI server
python main.py
# Server runs on http://localhost:8000 (API docs at http://localhost:8000/docs)
```

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Application runs on http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description | Sample Response |
|---|---|---|---|
| `GET` | `/api/waitlist/count` | Returns live total waitlist count | `{"count": 128}` |
| `POST` | `/api/waitlist` | Registers new waitlist entry | `{"success": true, "message": "Successfully joined the waitlist!"}` |

### POST `/api/waitlist` Payload
```json
{
  "name": "Alex Rivers",
  "email": "alex@example.com",
  "user_type": "creator",
  "platform": "instagram",
  "handle": "@alexrivers"
}
```

---

## Quality & Build Commands

### Frontend (`cd frontend`)
- `npm run dev`: Launch local development server with HMR.
- `npm run build`: Type-check with `tsc -b` and produce optimized production bundle in `dist/`.
- `npm run lint`: Fast linting with `oxlint`.
- `npm run preview`: Locally serve production bundle.

### Backend (`cd backend`)
- `uvicorn main:app --reload --port 8000`: Run backend with auto-reloading.

---

## Security & Privacy Note

- **Secrets**: Privileged database keys and secrets must never be placed in frontend code or committed to Git.
- **Legal Documents**: The included Terms & Conditions, Privacy Policy, and Cookie Policy contain draft text and placeholders (`[PLACEHOLDER]`) and require review by a qualified legal adviser before production release.

---

## License

Private & proprietary — Bizele Cloud.
