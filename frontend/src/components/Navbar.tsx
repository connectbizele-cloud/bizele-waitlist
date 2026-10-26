import { useState, useEffect } from 'react';
import MagneticButton from './MagneticButton';
import Bee from './Bee';
import { useRole } from '../context/RoleContext';
import './Navbar.css';

interface NavbarProps {
  onJoinClick: () => void;
  onSwitchRole?: () => void;
}

export default function Navbar({ onJoinClick, onSwitchRole }: NavbarProps) {
  const { role } = useRole();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container navbar__inner">
        <a href="/" className="navbar__brand" aria-label="Bizele home">
          <img src="/logo.png" alt="Bizele" className="navbar__logo" width="36" height="36" />
          <span className="navbar__wordmark">Bizele</span>
          <div className="navbar__mascot-tag" title="Powered by BEE AI">
            <Bee className="navbar__bee-mascot" state="idle" mood="happy" wings="css" />
            <span>BEE</span>
          </div>
        </a>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <a href="#platform" className="navbar__link" onClick={() => setMobileOpen(false)}>Platform</a>
          <a href="#bee-ai" className="navbar__link" onClick={() => setMobileOpen(false)}>BEE AI</a>
          <a href="#how-it-works" className="navbar__link" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#join" className="navbar__link" onClick={() => setMobileOpen(false)}>Early Access</a>

          {role && onSwitchRole && (
            <div className="navbar__role-indicator">
              <span className="navbar__role-label">
                {role === 'creator' ? '🎨 Creator' : '🏢 Business'}
              </span>
              <button
                className="navbar__switch-btn"
                onClick={() => { onSwitchRole(); setMobileOpen(false); }}
                aria-label="Switch role"
              >
                Switch
              </button>
            </div>
          )}

          <MagneticButton
            className="btn--primary btn--sm navbar__cta"
            onClick={() => {
              onJoinClick();
              setMobileOpen(false);
            }}
            strength={0.2}
            ariaLabel="Join Waitlist"
          >
            Join Waitlist
          </MagneticButton>
        </div>

        <button
          className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
