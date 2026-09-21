export type UserType = 'creator' | 'brand';

export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'other';

export interface CreatorPayload {
  fullName: string;
  email: string;
  userType: 'creator';
  socialHandle: string;
  socialPlatform: SocialPlatform;
}

export interface BrandPayload {
  fullName: string;
  email: string;
  userType: 'brand';
  brandName: string;
  website: string;
  companySize: string;
}

export type WaitlistPayload = CreatorPayload | BrandPayload;

export interface ApiSuccessResponse {
  success: true;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  code: 'DUPLICATE_EMAIL' | 'VALIDATION_ERROR' | 'SERVER_ERROR';
  message?: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface WaitlistCountResponse {
  count: number;
}
