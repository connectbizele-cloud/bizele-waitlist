# Bizele — Dynamic Pre-Launch Waitlist

> **The smarter way to connect brands and creators.** AI-powered matching that helps brands discover authentic creators and creators land high-ROI paid sponsorship deals.

![Bizele](frontend/public/logo.png)

---

## Overview

Bizele is a two-sided marketplace engineered for the modern creator economy. This repository contains the **high-conversion, motion-driven pre-launch waitlist web application** built with a full-stack architecture:

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS design system, and custom physics/canvas motion engines.
- **Backend**: FastAPI (Python), Pydantic v2 data validation, and CORS security.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) and real-time aggregate count tracking.

---

## Key Features

- **Cinematic & Living Hero**: Interactive HTML5 network canvas with spring-based cursor tracking, traveling energy particles, and floating ambient UI insight pills.
- **Real-Time Live Counter Odometer**: Smooth rolling count-up animation and pulsating emerald radar status representing the actual database registrations (zero simulated numbers).
- **Magnetic Physics CTAs**: Tactile cursor attraction with hover glow and micro-bounce on click (auto-disabled on touch and reduced-motion devices).
- **Interactive Dual Experience**: Dynamic Creator vs. Brand card expansion, benefits reveal, and central pulsating SVG connection filament.
- **Evolving AI Pipeline**: 4-stage interactive stepper (`DISCOVER` → `MATCH` → `COLLABORATE` → `GROW`) with morphing visualizations (radar scanning, match scoring, contract workflow, ROAS scaling).
- **Production-Ready Registration Modal**: Dual-role form (Creator / Brand), real-time field validation, keyboard `Escape` closing, duplicate email prevention, and smooth scale entrance.
- **60fps Performance & Accessibility**: Zero heavy animation frameworks, GPU-accelerated transforms (`transform`, `opacity`, `filter`), and full `prefers-reduced-motion` compliance.

---

## Quick Start

For full prerequisites and step-by-step instructions, see the **[Setup Guide (setup.md)](setup.md)**.

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your Supabase credentials
python main.py        # Starts server on http://localhost:8000
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev           # Starts app on http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint | Description | Response Schema |
|---|---|---|---|
| `GET` | `/api/waitlist/count` | Aggregate waitlist count | `{"count": number}` |
| `POST` | `/api/waitlist` | Register creator or brand | `{"success": true, "message": "..."}` or `{"success": false, "code": "...", "message": "..."}` |

Detailed contracts are documented in [docs/API.md](docs/API.md).

---

## Project Structure

```
Bizele-Waitlist/
├── backend/
│   ├── main.py               # FastAPI routes, exception handlers & Pydantic models
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variable template
├── frontend/
│   ├── src/
│   │   ├── components/       # Hero, Platform, HowItWorks, FinalCTA, WaitlistModal, etc.
│   │   ├── hooks/            # useWaitlist custom hook
│   │   ├── lib/              # API fetch client
│   │   └── types/            # TypeScript interfaces & enums
│   ├── package.json          # Dependencies & scripts
│   └── vite.config.ts        # Vite proxy configuration
├── docs/                     # Specifications: PRODUCT, BRAND, UX-DESIGN, API, DATABASE
├── setup.md                  # Comprehensive local setup guide
└── README.md                 # Project documentation
```

---

## Scripts

### Frontend (`cd frontend`)
- `npm run dev`: Start local development server
- `npm run build`: Type-check with `tsc -b` and build production bundle
- `npm run lint`: Fast linting with `oxlint`
- `npm run preview`: Preview production build locally

### Backend (`cd backend`)
- `python main.py`: Start API server with auto-reload on port 8000
- `uvicorn main:app --port 8000`: Run with Uvicorn ASGI server

---

## License

Private & proprietary — Bizele Cloud.
