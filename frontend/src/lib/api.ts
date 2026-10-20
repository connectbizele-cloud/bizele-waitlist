import type { ApiResponse, WaitlistCountResponse, WaitlistPayload } from '../types/waitlist';

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

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
      message: 'Unable to connect. Please try again.',
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
