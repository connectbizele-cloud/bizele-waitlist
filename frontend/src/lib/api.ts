import type { ApiResponse, WaitlistCountResponse, WaitlistPayload } from '../types/waitlist';

// Default to Render backend in production if VITE_API_URL is not explicitly configured
const DEFAULT_PROD_API = 'https://bizele-waitlist.onrender.com';
const BASE_URL = (
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? DEFAULT_PROD_API : '')
).replace(/\/+$/, '');

export async function submitWaitlist(payload: WaitlistPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch {
    return {
      success: false,
      code: 'SERVER_ERROR',
      message: 'Unable to connect to the waitlist service. Please try again.',
    };
  }
}

export async function fetchWaitlistCount(): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/api/waitlist/count`);
    const data: WaitlistCountResponse = await response.json();
    return data.count;
  } catch {
    return 0;
  }
}
