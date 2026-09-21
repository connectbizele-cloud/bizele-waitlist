import './Footer.css';

export default function Footer() {
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
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">&copy; {new Date().getFullYear()} Bizele. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
