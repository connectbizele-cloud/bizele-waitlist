import { useEffect, useRef, useState } from 'react';
import './CounterOdometer.css';

interface CounterOdometerProps {
  value: number;
  label?: string;
  showLiveBadge?: boolean;
}

export default function CounterOdometer({
  value,
  label = 'people already waiting',
  showLiveBadge = true,
}: CounterOdometerProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startVal = prevValueRef.current;
    const endVal = value;
    const startTime = performance.now();
    const duration = prefersReducedMotion ? 0 : Math.abs(endVal - startVal) <= 5 ? 400 : 1100;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
      const ease = duration === 0 ? 1 : 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * ease);

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endVal;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [value]);

  return (
    <div className="odometer-wrap" aria-live="polite">
      {showLiveBadge && (
        <div className="odometer__live-pill">
          <span className="odometer__radar">
            <span className="odometer__radar-dot" />
            <span className="odometer__radar-ring" />
          </span>
          <span className="odometer__live-text">LIVE</span>
        </div>
      )}

      <div className="odometer__count">
        <span className="odometer__digits">{displayValue.toLocaleString()}</span>
      </div>

      {label && <p className="odometer__label">{label}</p>}
    </div>
  );
}
