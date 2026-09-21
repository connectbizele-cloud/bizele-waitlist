import type { ApiResponse, WaitlistCountResponse, WaitlistPayload } from '../types/waitlist';

export async function submitWaitlist(payload: WaitlistPayload): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/waitlist', {
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
    const response = await fetch('/api/waitlist/count');
    const data: WaitlistCountResponse = await response.json();
    return data.count;
  } catch {
    return 0;
  }
}
