import './LegalPage.css';

interface LegalPageProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalPage({ children, title, lastUpdated }: LegalPageProps) {
  return (
    <div className="legal-page">
      {/* Sticky back link */}
      <div className="legal-page__topbar">
        <div className="container">
          <a href="/" className="legal-page__back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Bizele
          </a>
        </div>
      </div>

      <main className="container legal-page__main">
        {/* Logo */}
        <div className="legal-page__brand">
          <img src="/logo.png" alt="Bizele" className="legal-page__logo" width="32" height="32" />
          <span className="legal-page__wordmark">Bizele</span>
        </div>

        <header className="legal-page__header">
          <h1 className="legal-page__title">{title}</h1>
          <p className="legal-page__date">Last updated: {lastUpdated}</p>
        </header>

        <article className="legal-page__content">
          {children}
        </article>

        <footer className="legal-page__footer">
          <div className="legal-page__footer-links">
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-and-conditions">Terms &amp; Conditions</a>
            <a href="/cookie-policy">Cookie Policy</a>
            <a href="/faq">FAQs</a>
            <a href="/">Home</a>
          </div>
          <p className="legal-page__copy">
            &copy; {new Date().getFullYear()} Bizele. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
