import { useRef, useState, type PointerEvent } from 'react';
import MagneticButton from './MagneticButton';
import './FinalCTA.css';

interface FinalCTAProps {
  count: number;
  onJoinClick: () => void;
}

export default function FinalCTA({ count, onJoinClick }: FinalCTAProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    setGradientPos({ x: xPercent, y: yPercent });
  };

  return (
    <section
      ref={containerRef}
      className="final-cta section--dark"
      id="join"
      onPointerMove={handlePointerMove}
      style={
        {
          '--grad-x': `${gradientPos.x}%`,
          '--grad-y': `${gradientPos.y}%`,
        } as React.CSSProperties
      }
    >
      <div className="final-cta__ambient-light" aria-hidden="true" />

      <div className="container final-cta__inner">
        <div className="final-cta__live-pill">
          <span className="final-cta__live-dot" />
          <span>JOIN WAVE ONE</span>
        </div>

        <h2 className="final-cta__title">
          Don't Miss the First Wave
        </h2>

        <p className="final-cta__desc">
          <strong className="final-cta__count-highlight">{count.toLocaleString()}</strong> people already waiting to connect.
          Be first in line when Bizele goes live.
        </p>

        <div className="final-cta__button-wrap">
          <MagneticButton
            className="btn--primary btn--lg final-cta__btn"
            onClick={onJoinClick}
            ariaLabel="Join the waitlist now"
          >
            Join the Waitlist
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MagneticButton>
        </div>

        <p className="final-cta__footnote">
          Instant confirmation · Zero spam · Priority onboarding
        </p>
      </div>
    </section>
  );
}
