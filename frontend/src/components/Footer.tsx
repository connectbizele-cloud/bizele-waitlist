import { useCookieConsent } from '../context/CookieConsentContext';
import './Footer.css';

export default function Footer() {
  const { openBanner } = useCookieConsent();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo-row">
            <img src="/logo.png" alt="Bizele" className="footer__logo" width="32" height="32" />
            <span className="footer__wordmark">Bizele</span>
          </div>
          <p className="footer__tagline">
            Connecting brands with influence. AI-powered creator-brand matching for the modern marketing era.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__column">
            <h4 className="footer__column-title">Product</h4>
            <a href="#platform" className="footer__link">For Brands</a>
            <a href="#platform" className="footer__link">For Creators</a>
            <a href="#how-it-works" className="footer__link">How It Works</a>
          </div>

          <div className="footer__column">
            <h4 className="footer__column-title">Connect</h4>
            <a href="#" className="footer__link" aria-label="Twitter">Twitter / X</a>
            <a href="#" className="footer__link" aria-label="Instagram">Instagram</a>
            <a href="#" className="footer__link" aria-label="LinkedIn">LinkedIn</a>
          </div>

          <div className="footer__column">
            <h4 className="footer__column-title">Legal</h4>
            <a href="/privacy-policy" className="footer__link">Privacy Policy</a>
            <a href="/terms-and-conditions" className="footer__link">Terms &amp; Conditions</a>
            <a href="/cookie-policy" className="footer__link">Cookie Policy</a>
            <button
              className="footer__link footer__cookie-settings"
              onClick={openBanner}
              type="button"
              aria-label="Open cookie settings"
            >
              Cookie Settings
            </button>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">&copy; {new Date().getFullYear()} Bizele. All rights reserved.</p>
          <div className="footer__bottom-legal">
            <a href="/privacy-policy" className="footer__bottom-link">Privacy</a>
            <span aria-hidden="true">·</span>
            <a href="/terms-and-conditions" className="footer__bottom-link">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="/cookie-policy" className="footer__bottom-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
