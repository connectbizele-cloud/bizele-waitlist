import { useState } from 'react';
import './Platform.css';

interface PlatformProps {
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

export default function Platform({ onJoinClick }: PlatformProps) {
  const [activeSide, setActiveSide] = useState<'creator' | 'brand'>('creator');

  return (
    <section className="section section--dark platform" id="platform">
      <div className="container">
        <div className="platform__header">
          <span className="section__label">Built for Both Sides</span>
          <h2 className="section__title">One Platform. Two Connected Experiences.</h2>
          <p className="platform__sub">
            Hover or tap either side to see how Bizele powers both creators and brands.
          </p>
        </div>

        {/* Central visual connection beam */}
        <div className="platform__bridge" aria-hidden="true">
          <div className={`platform__node ${activeSide === 'creator' ? 'platform__node--active' : ''}`}>
            <span className="platform__node-dot" />
            <span className="platform__node-name">CREATOR</span>
          </div>

          <div className="platform__line-wrap">
            <svg className="platform__line-svg" viewBox="0 0 320 24" fill="none">
              <path d="M 0 12 H 320" stroke="rgba(200, 106, 134, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
              <path
                d="M 0 12 H 320"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                className={`platform__line-active ${activeSide === 'creator' ? 'platform__line-active--creator' : 'platform__line-active--brand'}`}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C86A86" />
                  <stop offset="50%" stopColor="#7B3260" />
                  <stop offset="100%" stopColor="#8D2637" />
                </linearGradient>
              </defs>
            </svg>
            <div className="platform__center-hub">
              <span className="platform__center-pulse" />
              <span className="platform__center-text">BIZELE</span>
            </div>
          </div>

          <div className={`platform__node ${activeSide === 'brand' ? 'platform__node--active' : ''}`}>
            <span className="platform__node-dot" />
            <span className="platform__node-name">BRAND</span>
          </div>
        </div>

        {/* Mobile toggle switcher */}
        <div className="platform__mobile-toggle">
          <button
            type="button"
            className={`platform__tab ${activeSide === 'creator' ? 'platform__tab--active' : ''}`}
            onClick={() => setActiveSide('creator')}
          >
            🎨 For Creators
          </button>
          <button
            type="button"
            className={`platform__tab ${activeSide === 'brand' ? 'platform__tab--active' : ''}`}
            onClick={() => setActiveSide('brand')}
          >
            🏢 For Brands
          </button>
        </div>

        {/* Interactive side-by-side cards */}
        <div className="platform__grid">
          {/* Creator Card */}
          <div
            className={`platform__card ${activeSide === 'creator' ? 'platform__card--expanded' : 'platform__card--compressed'}`}
            onMouseEnter={() => setActiveSide('creator')}
            onClick={() => setActiveSide('creator')}
            role="region"
            aria-label="Creator Experience"
          >
            <div className="platform__card-top">
              <span className="platform__icon">🎨</span>
              <span className="platform__role-tag">Creators & Influencers</span>
            </div>

            <h3 className="platform__card-title">Monetize Your Creative Voice</h3>
            <p className="platform__card-desc">
              Build your professional portfolio, get verified by AI matching, and receive sponsorship offers that genuinely fit your niche and audience.
            </p>

            <div className="platform__benefits">
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>AI Brand Matching:</strong> Never pitch blindly. Get matched with brands whose products your followers love.
                </div>
              </div>
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>Showcase Portfolio:</strong> Verified engagement stats, past campaign proofs, and direct rate cards.
                </div>
              </div>
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>Guaranteed Payouts:</strong> Secure escrow deals so you get paid on time, every time.
                </div>
              </div>
            </div>

            <button
              className="btn btn--primary btn--sm platform__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onJoinClick('creator');
              }}
            >
              Join as a Creator →
            </button>
          </div>

          {/* Brand Card */}
          <div
            className={`platform__card ${activeSide === 'brand' ? 'platform__card--expanded' : 'platform__card--compressed'}`}
            onMouseEnter={() => setActiveSide('brand')}
            onClick={() => setActiveSide('brand')}
            role="region"
            aria-label="Brand Experience"
          >
            <div className="platform__card-top">
              <span className="platform__icon">🏢</span>
              <span className="platform__role-tag">Brands & Agencies</span>
            </div>

            <h3 className="platform__card-title">Scale High-ROI Sponsorships</h3>
            <p className="platform__card-desc">
              Discover authentic creators who move product, automate negotiations and contracts, and track full-funnel attribution in real time.
            </p>

            <div className="platform__benefits">
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>Deep Audience Intelligence:</strong> Detect fake followers, real engagement velocity, and demographic overlap.
                </div>
              </div>
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>Automated Campaign Workflows:</strong> Briefs, deliverables, revisions, and contracts in one place.
                </div>
              </div>
              <div className="platform__benefit-item">
                <span className="platform__benefit-check">✓</span>
                <div>
                  <strong>Measurable ROI Tracking:</strong> Track conversions, coupon redemptions, and ROAS per creator.
                </div>
              </div>
            </div>

            <button
              className="btn btn--primary btn--sm platform__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onJoinClick('brand');
              }}
            >
              Join as a Brand →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
