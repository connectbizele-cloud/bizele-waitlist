import './Platform.css';

interface PlatformProps {
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

export default function Platform({ onJoinClick }: PlatformProps) {
  return (
    <section className="section section--dark platform" id="platform">
      <div className="container">
        <span className="section__label">Built for Both Sides</span>
        <h2 className="section__title">One Platform. Two Experiences.</h2>

        <div className="platform__grid">
          <div className="platform__card">
            <span className="platform__icon">🏢</span>
            <h3 className="platform__card-title">For Brands</h3>
            <p className="platform__card-desc">
              Discover creators that actually match your brand, run campaigns, and track real performance — all powered by AI.
            </p>
            <ul className="platform__list">
              <li>AI creator discovery & matching</li>
              <li>Campaign management & tracking</li>
              <li>Data-driven growth decisions</li>
            </ul>
            <button className="btn btn--ghost btn--sm" onClick={() => onJoinClick('brand')}>
              Join as a Brand →
            </button>
          </div>

          <div className="platform__card">
            <span className="platform__icon">🎨</span>
            <h3 className="platform__card-title">For Creators</h3>
            <p className="platform__card-desc">
              Build your professional profile, get matched with brands, and find paid collaborations that fit your content.
            </p>
            <ul className="platform__list">
              <li>Professional portfolio & profile</li>
              <li>AI-powered brand matching</li>
              <li>Collaboration & career growth</li>
            </ul>
            <button className="btn btn--ghost btn--sm" onClick={() => onJoinClick('creator')}>
              Join as a Creator →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
