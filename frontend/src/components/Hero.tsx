import './Hero.css';

interface HeroProps {
  count: number;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

export default function Hero({ count, onJoinClick }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Pre-Launch — Early Access Open
        </div>

        <h1 className="hero__title">
          The Smarter Way to Connect
          <br />
          <span className="hero__title-accent">Brands & Creators.</span>
        </h1>

        <p className="hero__subtitle">
          AI-powered matching that helps brands find the right creators and creators find the right deals.
        </p>

        {/* Live waitlist counter — primary social proof */}
        <div className="hero__counter-block">
          <div className="hero__counter-number">{count.toLocaleString()}</div>
          <div className="hero__counter-label">
            {count === 1 ? 'person' : 'people'} already on the waitlist
          </div>
        </div>

        <div className="hero__cta-group">
          <button className="btn btn--primary btn--lg hero__main-cta" onClick={() => onJoinClick()}>
            Join the Waitlist
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="hero__roles">
          <button className="hero__role" onClick={() => onJoinClick('creator')}>
            <span className="hero__role-icon">🎨</span>
            I'm a Creator
          </button>
          <span className="hero__role-sep">·</span>
          <button className="hero__role" onClick={() => onJoinClick('brand')}>
            <span className="hero__role-icon">🏢</span>
            I'm a Brand
          </button>
        </div>
      </div>
    </section>
  );
}
