import { useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import './CookieBanner.css';

type Panel = 'banner' | 'customize';

export default function CookieBanner() {
  const { isBannerVisible, acceptAll, rejectOptional, saveCustom } = useCookieConsent();
  const [panel, setPanel] = useState<Panel>('banner');

  // Custom preference toggles
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);

  if (!isBannerVisible) return null;

  function handleSaveCustom() {
    saveCustom({ analytics: analyticsOn, marketing: marketingOn });
  }

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie preferences"
      aria-live="polite"
    >
      <div className="cookie-banner__inner">
        {panel === 'banner' ? (
          /* ── Main banner ───────────────────────────────────────────────── */
          <>
            <div className="cookie-banner__content">
              <div className="cookie-banner__icon" aria-hidden="true">🍪</div>
              <div className="cookie-banner__text">
                <p className="cookie-banner__copy">
                  We use cookies to improve your experience and understand website usage.{' '}
                  <a href="/cookie-policy" className="cookie-banner__link">
                    Cookie Policy
                  </a>
                  {' · '}
                  <a href="/privacy-policy" className="cookie-banner__link">
                    Privacy Policy
                  </a>
                </p>
                <p className="cookie-banner__note">
                  Essential cookies keep the site working and cannot be disabled.
                  Optional cookies (analytics, marketing) are only placed with your
                  consent. Your choice is remembered.
                </p>
              </div>
            </div>

            <div className="cookie-banner__actions">
              <button
                className="cookie-btn cookie-btn--ghost"
                type="button"
                onClick={() => setPanel('customize')}
                id="cookie-customize-btn"
              >
                Customize
              </button>
              <button
                className="cookie-btn cookie-btn--outline"
                type="button"
                onClick={rejectOptional}
                id="cookie-reject-btn"
              >
                Reject Optional
              </button>
              <button
                className="cookie-btn cookie-btn--primary"
                type="button"
                onClick={acceptAll}
                id="cookie-accept-btn"
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          /* ── Preferences panel ─────────────────────────────────────────── */
          <>
            <div className="cookie-panel__header">
              <button
                className="cookie-panel__back"
                type="button"
                onClick={() => setPanel('banner')}
                aria-label="Back to cookie banner"
              >
                ← Back
              </button>
              <h2 className="cookie-panel__title">Cookie Preferences</h2>
            </div>

            <div className="cookie-panel__body">
              {/* Essential — always on */}
              <CookieCategory
                id="essential"
                title="Essential Cookies"
                description="Required for the website to function correctly — account access, security, session management. Cannot be disabled."
                enabled
                locked
              />

              {/* Analytics */}
              <CookieCategory
                id="analytics"
                title="Analytics Cookies"
                description="Help us understand how visitors use the site (e.g. page views, user journeys) so we can improve performance and content. No personally identifiable data is sold."
                enabled={analyticsOn}
                onChange={setAnalyticsOn}
              />

              {/* Marketing */}
              <CookieCategory
                id="marketing"
                title="Marketing Cookies"
                description="May be used to measure advertising effectiveness and deliver relevant content. Only activated when applicable tools are live."
                enabled={marketingOn}
                onChange={setMarketingOn}
              />
            </div>

            <p className="cookie-panel__disclaimer">
              These settings do not guarantee legal compliance for your jurisdiction — please
              review with a legal adviser before publishing.
            </p>

            <div className="cookie-banner__actions">
              <button
                className="cookie-btn cookie-btn--outline"
                type="button"
                onClick={rejectOptional}
              >
                Reject Optional
              </button>
              <button
                className="cookie-btn cookie-btn--primary"
                type="button"
                onClick={handleSaveCustom}
                id="cookie-save-prefs-btn"
              >
                Save Preferences
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Helper sub-component ────────────────────────────────────────────────── */
interface CookieCategoryProps {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onChange?: (v: boolean) => void;
}

function CookieCategory({ id, title, description, enabled, locked, onChange }: CookieCategoryProps) {
  return (
    <div className="cookie-category">
      <div className="cookie-category__header">
        <label className="cookie-category__label" htmlFor={`toggle-${id}`}>
          {title}
          {locked && <span className="cookie-category__always-on">Always On</span>}
        </label>
        <button
          id={`toggle-${id}`}
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={locked}
          className={`cookie-toggle ${enabled ? 'cookie-toggle--on' : ''}`}
          onClick={() => onChange?.(!enabled)}
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${title}`}
        >
          <span className="cookie-toggle__thumb" />
        </button>
      </div>
      <p className="cookie-category__desc">{description}</p>
    </div>
  );
}
