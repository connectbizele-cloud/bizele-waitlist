import { useEffect, useState } from 'react';
import CounterOdometer from './CounterOdometer';
import HeroCanvas from './HeroCanvas';
import MagneticButton from './MagneticButton';
import './Hero.css';
import { useRole } from '../context/RoleContext';
import { roleConfig, roleToUserType } from '../config/roleConfig';

interface HeroProps {
  count: number;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

export default function Hero({ count, onJoinClick }: HeroProps) {
  const { role } = useRole();
  const heroContent = role ? roleConfig[role].hero : null;
  const mappedType = role ? roleToUserType(role) : undefined;

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subtle scroll transformation (up to 300px scroll)
  const heroTransformStyle = {
    transform: `translate3d(0, ${scrollY * 0.14}px, 0)`,
    opacity: Math.max(0.4, 1 - scrollY / 650),
  };

  return (
    <section className="hero" id="hero">
      {/* Ambient background glow */}
      <div className="hero__ambient-glow" aria-hidden="true" />

      <div className="container hero__container" style={heroTransformStyle}>
        {/* LEFT COLUMN: ~38.2% Content & Conversion Focal Point */}
        <div className="hero__content">
          {/* Eyebrow badge */}
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            <span>{heroContent?.badge || 'Pre-Launch — Early Access Open'}</span>
          </div>

          {/* Dominant H1 Headline */}
          <h1 className="hero__title">
            <span className="hero__reveal hero__reveal--1">{heroContent?.titleLines[0] || 'The Smarter Way'}</span>{' '}
            <span className="hero__reveal hero__reveal--2">{heroContent?.titleLines[1] || 'to Connect'}</span>
            <br />
            <span className="hero__title-accent hero__reveal hero__reveal--3">{heroContent?.titleAccent || 'Brands & Creators.'}</span>
          </h1>

          {/* Supporting product proposition */}
          <p className="hero__subtitle hero__reveal hero__reveal--4">
            {heroContent?.subtitle || 'AI-powered matching that helps brands discover authentic creators and helps creators land high-value deals.'}
          </p>

          {/* Gestalt interaction group: Waitlist proof + Primary CTA */}
          <div className="hero__action-group hero__reveal hero__reveal--5">
            <div className="hero__counter-card">
              <CounterOdometer
                value={count}
                label={count === 1 ? 'person already on the waitlist' : 'people already waiting'}
                showLiveBadge={true}
              />
            </div>

            <div className="hero__cta-wrap">
              <MagneticButton
                className="btn--primary btn--lg hero__main-cta"
                onClick={() => onJoinClick(mappedType)}
                ariaLabel={heroContent?.ctaLabel || 'Join the waitlist'}
              >
                {heroContent?.ctaLabel || 'Join the Waitlist'}
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </div>

            {/* Role quick triggers */}
            <div className="hero__roles">
              <span className="hero__roles-label">I want to join as:</span>
              <button className="hero__role" onClick={() => onJoinClick('creator')}>
                <span className="hero__role-icon">🎨</span>
                Creator
              </button>
              <span className="hero__role-sep" aria-hidden="true">/</span>
              <button className="hero__role" onClick={() => onJoinClick('brand')}>
                <span className="hero__role-icon">🏢</span>
                Brand
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ~61.8% Interactive Brand-Creator Ecosystem Visual */}
        <div className="hero__visual hero__reveal hero__reveal--4" aria-hidden="true">
          <div className="hero__visual-frame">
            <HeroCanvas />

            {/* Floating illustrative UI insights */}
            <div className="hero__floating-elements">
              <div className="hero__float-pill hero__float-pill--1">
                <span className="hero__float-icon">✨</span>
                <span>Brand matched</span>
              </div>
              <div className="hero__float-pill hero__float-pill--2">
                <span className="hero__float-icon">🎨</span>
                <span>Creator discovered</span>
              </div>
              <div className="hero__float-pill hero__float-pill--3">
                <span className="hero__float-icon">🚀</span>
                <span>Campaign live</span>
              </div>
            </div>

            {/* Engine status indicator */}
            <div className="hero__visual-caption">
              <span className="hero__visual-status-dot" />
              <span>Bizele Neural Engine · Live interactive map</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
