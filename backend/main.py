# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException, Request
# pyrefly: ignore [missing-import]
from fastapi.exceptions import RequestValidationError
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional
import os
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Bizele Waitlist API", version="1.0.0")

# CORS — allow frontend origin
cors_origins_env = os.getenv("FRONTEND_URL", "")
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://bizele.in",
    "https://dev.bizele.in",
    "https://bizele-waitlist.pages.dev",
]
if cors_origins_env:
    for o in cors_origins_env.split(","):
        cleaned = o.strip()
        if cleaned and cleaned not in allowed_origins:
            allowed_origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.pages\.dev",
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception:
        supabase = None


# --- Exception Handlers (Ensure responses conform to API contract) ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = "Validation error"
    if errors:
        loc = errors[0].get("loc", [])
        field = loc[-1] if loc else "field"
        msg = errors[0].get("msg", "")
        first_msg = f"{field}: {msg}" if field != "body" else msg
    return JSONResponse(
        status_code=400,
        content={"success": False, "code": "VALIDATION_ERROR", "message": first_msg},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "code": "SERVER_ERROR", "message": str(exc.detail)},
    )


# --- Models ---

ALLOWED_PLATFORMS = {"instagram", "tiktok", "youtube", "twitter", "linkedin", "other"}
ALLOWED_COMPANY_SIZES = {"1-10", "11-50", "51-200", "201-500", "500+"}


class WaitlistRequest(BaseModel):
    fullName: str
    email: EmailStr
    userType: Literal["creator", "brand"]
    socialHandle: Optional[str] = None
    socialPlatform: Optional[str] = None
    brandName: Optional[str] = None
    website: Optional[str] = None
    companySize: Optional[str] = None

    @field_validator("fullName")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Full name is required")
        return v.strip()

    @field_validator("socialPlatform")
    @classmethod
    def validate_platform(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v_clean = v.strip().lower()
            if v_clean and v_clean not in ALLOWED_PLATFORMS:
                raise ValueError(f"Platform must be one of: {', '.join(sorted(ALLOWED_PLATFORMS))}")
            return v_clean
        return v

    @field_validator("companySize")
    @classmethod
    def validate_size(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v_clean = v.strip()
            if v_clean and v_clean not in ALLOWED_COMPANY_SIZES:
                raise ValueError(f"Company size must be one of: {', '.join(sorted(ALLOWED_COMPANY_SIZES))}")
            return v_clean
        return v


class SuccessResponse(BaseModel):
    success: bool = True
    message: str = "Successfully joined the waitlist"


class ErrorResponse(BaseModel):
    success: bool = False
    code: str
    message: Optional[str] = None


class CountResponse(BaseModel):
    count: int


# --- Routes ---

@app.post("/api/waitlist", response_model=SuccessResponse | ErrorResponse)
async def join_waitlist(payload: WaitlistRequest):
    """Register a new waitlist entry."""
    # Conditional field validations
    if payload.userType == "creator":
        if not payload.socialHandle or not payload.socialHandle.strip():
            return JSONResponse(
                status_code=400,
                content={"success": False, "code": "VALIDATION_ERROR", "message": "Social handle is required for creators"},
            )
        if not payload.socialPlatform:
            return JSONResponse(
                status_code=400,
                content={"success": False, "code": "VALIDATION_ERROR", "message": "Social platform is required for creators"},
            )
    elif payload.userType == "brand":
        if not payload.brandName or not payload.brandName.strip():
            return JSONResponse(
                status_code=400,
                content={"success": False, "code": "VALIDATION_ERROR", "message": "Brand name is required for brands"},
            )
        if not payload.website or not payload.website.strip():
            return JSONResponse(
                status_code=400,
                content={"success": False, "code": "VALIDATION_ERROR", "message": "Website is required for brands"},
            )
        if not payload.companySize:
            return JSONResponse(
                status_code=400,
                content={"success": False, "code": "VALIDATION_ERROR", "message": "Company size is required for brands"},
            )

    if not supabase:
        return JSONResponse(
            status_code=503,
            content={"success": False, "code": "SERVER_ERROR", "message": "Database not configured yet. Please check back soon."},
        )

    # Build insert data
    data = {
        "email": str(payload.email).lower(),
        "full_name": payload.fullName.strip(),
        "user_type": payload.userType,
        "social_handle": payload.socialHandle.strip() if payload.socialHandle else None,
        "social_platform": payload.socialPlatform if payload.socialPlatform else None,
        "brand_name": payload.brandName.strip() if payload.brandName else None,
        "website": payload.website.strip() if payload.website else None,
        "company_size": payload.companySize if payload.companySize else None,
    }

    try:
        supabase.table("waitlist").insert(data).execute()
        return SuccessResponse()
    except Exception as e:
        error_msg = str(e).lower()
        if "duplicate" in error_msg or "unique" in error_msg or "23505" in error_msg:
            return JSONResponse(
                status_code=409,
                content={"success": False, "code": "DUPLICATE_EMAIL", "message": "This email is already on the waitlist"},
            )
        return JSONResponse(
            status_code=500,
            content={"success": False, "code": "SERVER_ERROR", "message": "Something went wrong. Please try again."},
        )


@app.get("/api/waitlist/count", response_model=CountResponse)
async def get_waitlist_count():
    """Return the total number of waitlist registrations."""
    if not supabase:
        return CountResponse(count=0)

    try:
        result = supabase.table("waitlist").select("id", count="exact").execute()
        return CountResponse(count=result.count or 0)
    except Exception:
        return CountResponse(count=0)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
