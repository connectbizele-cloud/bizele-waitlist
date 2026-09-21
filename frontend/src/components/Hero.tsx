import { useEffect, useState } from 'react';
import CounterOdometer from './CounterOdometer';
import HeroCanvas from './HeroCanvas';
import MagneticButton from './MagneticButton';
import './Hero.css';

interface HeroProps {
  count: number;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

export default function Hero({ count, onJoinClick }: HeroProps) {
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
      {/* Interactive ecosystem canvas */}
      <HeroCanvas />

      {/* Floating illustrative UI pills (3-4 items) */}
      <div className="hero__floating-elements" aria-hidden="true">
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

      <div className="container hero__inner" style={heroTransformStyle}>
        {/* Pre-launch badge with radar pulse */}
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Pre-Launch — Early Access Open
        </div>

        {/* Word-by-word reveal heading */}
        <h1 className="hero__title">
          <span className="hero__reveal hero__reveal--1">The Smarter Way</span>{' '}
          <span className="hero__reveal hero__reveal--2">to Connect</span>
          <br />
          <span className="hero__title-accent hero__reveal hero__reveal--3">Brands & Creators.</span>
        </h1>

        <p className="hero__subtitle hero__reveal hero__reveal--4">
          AI-powered matching that helps brands find the right creators and creators find the right deals.
        </p>

        {/* Dynamic Odometer Waitlist Counter */}
        <div className="hero__counter-card hero__reveal hero__reveal--5">
          <CounterOdometer
            value={count}
            label={count === 1 ? 'person already on the waitlist' : 'people already on the waitlist'}
            showLiveBadge={true}
          />
        </div>

        {/* Magnetic Primary CTA */}
        <div className="hero__cta-group hero__reveal hero__reveal--6">
          <MagneticButton
            className="btn--primary btn--lg hero__main-cta"
            onClick={() => onJoinClick()}
            ariaLabel="Join the waitlist"
          >
            Join the Waitlist
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </div>

        {/* Direct role shortcuts */}
        <div className="hero__roles hero__reveal hero__reveal--6">
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
