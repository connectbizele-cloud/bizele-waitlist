import { useCallback, useEffect, useState } from 'react';
import { fetchWaitlistCount, submitWaitlist } from '../lib/api';
import type { ApiResponse, WaitlistPayload } from '../types/waitlist';

interface UseWaitlistReturn {
  count: number;
  isLoading: boolean;
  isSubmitting: boolean;
  response: ApiResponse | null;
  submit: (payload: WaitlistPayload) => Promise<void>;
  resetResponse: () => void;
}

export function useWaitlist(): UseWaitlistReturn {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetchWaitlistCount()
      .then(setCount)
      .finally(() => setIsLoading(false));
  }, []);

  const submit = useCallback(async (payload: WaitlistPayload) => {
    setIsSubmitting(true);
    setResponse(null);
    try {
      const result = await submitWaitlist(payload);
      setResponse(result);
      if (result.success) {
        setCount((prev) => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const resetResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return { count, isLoading, isSubmitting, response, submit, resetResponse };
}
