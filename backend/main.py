from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Bizele Waitlist API", version="1.0.0")

# CORS — allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:5173"),
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client | None = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# --- Models ---

class CreatorPayload(BaseModel):
    fullName: str
    email: EmailStr
    userType: Literal["creator"]
    socialHandle: str
    socialPlatform: str

    @field_validator("fullName", "socialHandle")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

    @field_validator("socialPlatform")
    @classmethod
    def valid_platform(cls, v: str) -> str:
        allowed = {"instagram", "tiktok", "youtube", "twitter", "linkedin", "other"}
        if v.lower() not in allowed:
            raise ValueError(f"Platform must be one of: {', '.join(allowed)}")
        return v.lower()


class BrandPayload(BaseModel):
    fullName: str
    email: EmailStr
    userType: Literal["brand"]
    brandName: str
    website: str
    companySize: str

    @field_validator("fullName", "brandName", "website")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()

    @field_validator("companySize")
    @classmethod
    def valid_size(cls, v: str) -> str:
        allowed = {"1-10", "11-50", "51-200", "201-500", "500+"}
        if v not in allowed:
            raise ValueError(f"Company size must be one of: {', '.join(allowed)}")
        return v


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

@app.post("/api/waitlist")
async def join_waitlist(payload: WaitlistRequest):
    """Register a new waitlist entry."""
    # Validate conditional required fields
    if payload.userType == "creator":
        if not payload.socialHandle or not payload.socialHandle.strip():
            return ErrorResponse(code="VALIDATION_ERROR", message="Social handle is required for creators")
        if not payload.socialPlatform:
            return ErrorResponse(code="VALIDATION_ERROR", message="Social platform is required for creators")
    elif payload.userType == "brand":
        if not payload.brandName or not payload.brandName.strip():
            return ErrorResponse(code="VALIDATION_ERROR", message="Brand name is required for brands")
        if not payload.website or not payload.website.strip():
            return ErrorResponse(code="VALIDATION_ERROR", message="Website is required for brands")
        if not payload.companySize:
            return ErrorResponse(code="VALIDATION_ERROR", message="Company size is required for brands")

    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")

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
            return ErrorResponse(code="DUPLICATE_EMAIL", message="This email is already on the waitlist")
        return ErrorResponse(code="SERVER_ERROR", message="Something went wrong. Please try again.")


@app.get("/api/waitlist/count")
async def get_waitlist_count():
    """Return the total number of waitlist registrations."""
    if not supabase:
        return CountResponse(count=0)

    try:
        result = supabase.table("waitlist").select("id", count="exact").execute()
        return CountResponse(count=result.count or 0)
    except Exception:
        return CountResponse(count=0)
