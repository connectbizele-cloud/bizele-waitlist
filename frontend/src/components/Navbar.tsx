import { useState, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  onJoinClick: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
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
        </a>

        <div className={`navbar__links ${mobileOpen ? 'navbar__links--open' : ''}`}>
          <a href="#problem" className="navbar__link" onClick={() => setMobileOpen(false)}>Why Bizele</a>
          <a href="#platform" className="navbar__link" onClick={() => setMobileOpen(false)}>Platform</a>
          <a href="#how-it-works" className="navbar__link" onClick={() => setMobileOpen(false)}>How It Works</a>
          <button
            className="btn btn--primary btn--sm navbar__cta"
            onClick={() => { onJoinClick(); setMobileOpen(false); }}
          >
            Join Waitlist
          </button>
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
