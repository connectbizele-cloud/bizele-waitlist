import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------
export interface CookiePreferences {
  /** Essential cookies are always true — no toggle. */
  essential: true;
  analytics: boolean;
  marketing: boolean;
}

export type ConsentStatus = 'pending' | 'accepted_all' | 'rejected_optional' | 'customized';

interface CookieConsentContextValue {
  status: ConsentStatus;
  preferences: CookiePreferences;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveCustom: (prefs: Omit<CookiePreferences, 'essential'>) => void;
  openBanner: () => void;
  /** True while banner / preference panel should be shown */
  isBannerVisible: boolean;
}

// -----------------------------------------------------------------------
// Storage helpers
// -----------------------------------------------------------------------
const STORAGE_KEY = 'bizele_cookie_consent';

function load(): { status: ConsentStatus; preferences: CookiePreferences } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { status: ConsentStatus; preferences: CookiePreferences };
  } catch {
    return null;
  }
}

function save(status: ConsentStatus, preferences: CookiePreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, preferences }));
  } catch { /* ignore — private browsing */ }
}

// -----------------------------------------------------------------------
// Default preference: only essential cookies enabled
// -----------------------------------------------------------------------
const DEFAULT_PREFS: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

// -----------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------
const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used within CookieConsentProvider');
  return ctx;
}

// -----------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------
export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const stored = load();

  const [status, setStatus] = useState<ConsentStatus>(stored?.status ?? 'pending');
  const [preferences, setPreferences] = useState<CookiePreferences>(
    stored?.preferences ?? DEFAULT_PREFS,
  );
  // Banner is visible when status is 'pending' OR when the user explicitly
  // reopens it via the footer "Cookie Settings" link.
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(
    !stored || stored.status === 'pending',
  );

  // Whenever preferences change, conditionally activate optional technologies.
  // No third-party scripts are loaded currently; this is the consent gate
  // where analytics / marketing init should be called.
  useEffect(() => {
    if (preferences.analytics) {
      // TODO: initialise analytics (e.g. GA4) only when consent is given
    }
    if (preferences.marketing) {
      // TODO: initialise marketing pixels only when consent is given
    }
  }, [preferences]);

  const acceptAll = useCallback(() => {
    const prefs: CookiePreferences = { essential: true, analytics: true, marketing: true };
    setPreferences(prefs);
    setStatus('accepted_all');
    setIsBannerVisible(false);
    save('accepted_all', prefs);
  }, []);

  const rejectOptional = useCallback(() => {
    const prefs: CookiePreferences = { essential: true, analytics: false, marketing: false };
    setPreferences(prefs);
    setStatus('rejected_optional');
    setIsBannerVisible(false);
    save('rejected_optional', prefs);
  }, []);

  const saveCustom = useCallback((prefs: Omit<CookiePreferences, 'essential'>) => {
    const full: CookiePreferences = { essential: true, ...prefs };
    setPreferences(full);
    setStatus('customized');
    setIsBannerVisible(false);
    save('customized', full);
  }, []);

  const openBanner = useCallback(() => {
    setIsBannerVisible(true);
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{ status, preferences, acceptAll, rejectOptional, saveCustom, openBanner, isBannerVisible }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}
