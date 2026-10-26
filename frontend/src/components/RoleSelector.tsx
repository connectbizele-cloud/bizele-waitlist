import { useCallback, useEffect, useRef, useState } from 'react';
import { useRole, type Role } from '../context/RoleContext';
import Bee from './Bee';
import './RoleSelector.css';

interface RoleSelectorProps {
  onConfirm: () => void;
}

interface FloatItem {
  text: string;
  cls: string;
  mode: 'creator' | 'business';
  depth: string;
  style: React.CSSProperties;
}

/* ── Decorative floating elements ── */
const FLOATS: FloatItem[] = [
  // Creator
  { text: '@creator_vibes', cls: 'chip', mode: 'creator', depth: 'far', style: { top: '8%', left: '5%', animationDelay: '0s', animationDuration: '8s' } },
  { text: '1.2M views', cls: 'card', mode: 'creator', depth: 'mid', style: { top: '15%', right: '10%', animationDelay: '0.5s', animationDuration: '7s' } },
  { text: '98K likes', cls: 'card', mode: 'creator', depth: 'mid', style: { top: '38%', left: '3%', animationDelay: '1.2s', animationDuration: '6.5s' } },
  { text: 'Portfolio', cls: 'tag', mode: 'creator', depth: 'near', style: { bottom: '28%', right: '6%', animationDelay: '2s', animationDuration: '7.5s' } },
  { text: 'Brand Deal', cls: 'card', mode: 'creator', depth: 'near', style: { bottom: '14%', left: '7%', animationDelay: '0.7s', animationDuration: '6s' } },
  { text: 'REELS', cls: 'tag', mode: 'creator', depth: 'far', style: { top: '58%', left: '2%', animationDelay: '1s', animationDuration: '9s' } },
  { text: 'Campaign', cls: 'chip', mode: 'creator', depth: 'mid', style: { top: '5%', left: '28%', animationDelay: '1.8s', animationDuration: '7s' } },
  { text: 'Followers', cls: 'tag', mode: 'creator', depth: 'far', style: { top: '22%', right: '3%', animationDelay: '0.3s', animationDuration: '8.5s' } },
  { text: 'Instagram', cls: 'chip', mode: 'creator', depth: 'mid', style: { bottom: '22%', left: '2%', animationDelay: '1.5s', animationDuration: '7s' } },
  { text: 'YouTube', cls: 'chip', mode: 'creator', depth: 'far', style: { bottom: '38%', right: '3%', animationDelay: '2.3s', animationDuration: '8s' } },
  { text: 'Engagement', cls: 'tag', mode: 'creator', depth: 'near', style: { bottom: '6%', right: '12%', animationDelay: '0.9s', animationDuration: '6.5s' } },
  { text: 'TikTok', cls: 'chip', mode: 'creator', depth: 'near', style: { top: '70%', right: '4%', animationDelay: '2.1s', animationDuration: '7s' } },

  // Business
  { text: '+24.8% Growth', cls: 'card', mode: 'business', depth: 'mid', style: { top: '10%', right: '8%', animationDelay: '0s', animationDuration: '7s' } },
  { text: 'ROI 4.8×', cls: 'card', mode: 'business', depth: 'near', style: { top: '35%', left: '4%', animationDelay: '0.6s', animationDuration: '6.5s' } },
  { text: 'Campaign', cls: 'chip', mode: 'business', depth: 'far', style: { top: '6%', left: '8%', animationDelay: '1.2s', animationDuration: '8s' } },
  { text: 'Performance', cls: 'tag', mode: 'business', depth: 'mid', style: { bottom: '15%', right: '5%', animationDelay: '0.4s', animationDuration: '7.5s' } },
  { text: 'Creator Match 94%', cls: 'card', mode: 'business', depth: 'near', style: { top: '60%', right: '6%', animationDelay: '1.8s', animationDuration: '6s' } },
  { text: 'Analytics', cls: 'chip', mode: 'business', depth: 'far', style: { bottom: '25%', left: '3%', animationDelay: '2s', animationDuration: '8.5s' } },
  { text: 'Insights', cls: 'tag', mode: 'business', depth: 'mid', style: { top: '18%', left: '15%', animationDelay: '0.8s', animationDuration: '7s' } },
  { text: 'Revenue', cls: 'tag', mode: 'business', depth: 'far', style: { top: '48%', left: '2%', animationDelay: '1.5s', animationDuration: '9s' } },
  { text: 'AI Recommendation', cls: 'chip', mode: 'business', depth: 'mid', style: { top: '3%', left: '25%', animationDelay: '2.2s', animationDuration: '6.5s' } },
  { text: 'Conversion', cls: 'tag', mode: 'business', depth: 'near', style: { bottom: '8%', left: '10%', animationDelay: '0.3s', animationDuration: '7s' } },
  { text: 'Audience', cls: 'chip', mode: 'business', depth: 'far', style: { bottom: '35%', right: '2%', animationDelay: '1.1s', animationDuration: '8s' } },
  { text: 'Growth', cls: 'tag', mode: 'business', depth: 'near', style: { bottom: '5%', right: '20%', animationDelay: '1.9s', animationDuration: '6s' } },
];

export default function RoleSelector({ onConfirm }: RoleSelectorProps) {
  const { role, setRole } = useRole();
  const [selected, setSelected] = useState<Role | null>(role);
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Smooth parallax via rAF ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 50;
      ty = (e.clientY / window.innerHeight - 0.5) * 50;
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty('--px', `${cx}px`);
      el.style.setProperty('--py', `${cy}px`);
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── Lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSelect = useCallback(
    (r: Role) => {
      if (!isExiting) setSelected(r);
    },
    [isExiting],
  );

  const handleConfirm = useCallback(() => {
    if (!selected || isExiting) return;
    setRole(selected);
    setIsExiting(true);
    setTimeout(onConfirm, 900);
  }, [selected, isExiting, setRole, onConfirm]);

  const handleToggleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSelect('creator');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSelect('business');
      }
    },
    [handleSelect],
  );

  const modeClass = selected ? `rs--${selected}` : '';
  const exitClass = isExiting ? 'rs--exiting' : '';

  return (
    <div
      ref={containerRef}
      className={`rs ${modeClass} ${exitClass}`}
      role="main"
      aria-label="Choose your Bizele experience"
    >
      {/* Background gradient layers */}
      <div className="rs__bg" aria-hidden="true">
        <div className="rs__bg-creator" />
        <div className="rs__bg-business" />
      </div>

      {/* Floating decorative elements */}
      <div className="rs__scene" aria-hidden="true">
        {FLOATS.map((el, i) => (
          <span
            key={i}
            className={`rs__float rs__float--${el.cls} rs__float--${el.mode} rs__float--${el.depth}`}
            style={el.style}
          >
            {el.text}
          </span>
        ))}
      </div>

      {/* Central content */}
      <div className="rs__content" data-network-calm>
        {/* Branding */}
        <div className="rs__brand">
          <img src="/logo.png" alt="" width="44" height="44" className="rs__logo" />
          <span className="rs__wordmark">Bizele</span>
          <div className="rs__bee-badge" title="Powered by BEE">
            <Bee className="rs__bee-mascot" state={selected ? 'celebrating' : 'idle'} mood={selected ? 'happy' : 'normal'} wings="css" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="rs__heading">Are you a</h1>

        {/* Segmented toggle */}
        <div
          className="rs__toggle"
          role="radiogroup"
          aria-label="Select your role"
          onKeyDown={handleToggleKeyDown}
        >
          <div
            className={`rs__indicator${selected === 'business' ? ' rs__indicator--right' : ''}${!selected ? ' rs__indicator--hidden' : ''}`}
            aria-hidden="true"
          />
          <button
            role="radio"
            aria-checked={selected === 'creator'}
            className={`rs__toggle-btn${selected === 'creator' ? ' rs__toggle-btn--active' : ''}`}
            onClick={() => handleSelect('creator')}
            tabIndex={selected !== 'business' ? 0 : -1}
            id="role-creator"
          >
            Creator
          </button>
          <button
            role="radio"
            aria-checked={selected === 'business'}
            className={`rs__toggle-btn${selected === 'business' ? ' rs__toggle-btn--active' : ''}`}
            onClick={() => handleSelect('business')}
            tabIndex={selected === 'business' ? 0 : -1}
            id="role-business"
          >
            Business
          </button>
        </div>

        {/* Confirm */}
        <button
          className={`rs__confirm${selected ? ' rs__confirm--active' : ''}`}
          onClick={handleConfirm}
          disabled={!selected}
          aria-label="Confirm selection and enter Bizele"
          id="role-confirm"
        >
          <span className="rs__confirm-text">Confirm</span>
          <svg
            className="rs__confirm-arrow"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
