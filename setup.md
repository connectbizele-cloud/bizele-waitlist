# Bizele Waitlist — Setup Guide

This guide walks you through setting up and running both the frontend and backend of the Bizele waitlist website locally.

---

## 1. Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **Python**: v3.10 or higher ([Download Python](https://www.python.org/))
- **Git**
- A free **[Supabase](https://supabase.com/)** account for database persistence

---

## 2. Project Architecture

```
Bizele-Waitlist/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # API endpoints & validation
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment template
├── frontend/                 # Vite + React 19 + TypeScript frontend
│   ├── src/
│   │   ├── components/       # UI & motion components
│   │   ├── hooks/            # Custom hooks (useWaitlist)
│   │   ├── lib/              # API client
│   │   └── types/            # TypeScript definitions
│   ├── package.json          # Dependencies & scripts
│   └── vite.config.ts        # Proxy configuration (/api → localhost:8000)
├── docs/                     # Product, Brand, UX & API specifications
├── setup.md                  # This setup file
└── README.md                 # Project overview
```

---

## 3. Database Setup (Supabase)

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard) and click **New project**.
2. Name your project (e.g. `bizele-waitlist`) and set a secure database password.
3. Open the **SQL Editor** from the left navigation and run the following script:

```sql
-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('creator', 'brand')),
  social_handle TEXT,
  social_platform TEXT,
  brand_name TEXT,
  website TEXT,
  company_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow server-side service role full read/write access
CREATE POLICY "Allow service role full access" ON waitlist
  FOR ALL USING (auth.role() = 'service_role');
```

4. Go to **Project Settings** → **API** in Supabase and copy:
   - **Project URL** (`SUPABASE_URL`)
   - **`service_role` Secret Key** (`SUPABASE_SERVICE_ROLE_KEY`) *(Keep this secret!)*

---

## 4. Backend Setup (FastAPI)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. *(Optional but recommended)* Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables by creating `.env` from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   FRONTEND_URL=http://localhost:5173
   ```

5. Start the backend server:
   ```bash
   python main.py
   # Or using uvicorn directly:
   uvicorn main:app --reload --port 8000
   ```
   - API will be accessible at: `http://localhost:8000`
   - Interactive Swagger API docs: `http://localhost:8000/docs`

> [!NOTE]
> If Supabase credentials are not provided, the backend will still run gracefully. It returns a live count of `0` and friendly server notice if registration is attempted.

---

## 5. Frontend Setup (React + Vite)

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - The application will be running at: **`http://localhost:5173`**
   - The Vite dev server automatically proxies all `/api/*` calls to `http://localhost:8000`.

4. (Optional) Run tests and linter:
   ```bash
   # Type check and build production bundle
   npm run build

   # Run fast linter
   npm run lint
   ```

---

## 6. Verification Checklist

1. **Verify Backend Health**:
   Visit `http://localhost:8000/api/waitlist/count` in your browser or run:
   ```bash
   curl http://localhost:8000/api/waitlist/count
   ```
   Expected response: `{"count": 0}` (or current count from database).

2. **Verify Frontend**:
   - Open `http://localhost:5173` in your browser.
   - Verify the Hero interactive network canvas moves gently with your cursor.
   - Check that the live odometer counter loads the number.
   - Click **Join the Waitlist** to open the modal.
   - Test submitting as a **Creator** and as a **Brand**.
   - Press **Escape** to test closing the modal.
   - Hover over the Creator and Brand cards in the **Platform** section to verify dynamic expansion.
   - Click through the 4 stages in **How It Works** to verify evolving AI visuals.

---

## 7. Troubleshooting

- **CORS Errors**: Ensure `FRONTEND_URL` in `backend/.env` matches `http://localhost:5173`.
- **Database 503**: Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env` are populated without trailing spaces or quotes.
- **Port Conflicts**:
  - If port 8000 is occupied, change the port in `uvicorn main:app --port 8001` and update `target` in `frontend/vite.config.ts`.
  - If port 5173 is occupied, Vite will automatically select the next available port (e.g. 5174); update `FRONTEND_URL` in `backend/.env` accordingly.
