import { useState, useEffect, useRef } from 'react';
import CounterOdometer from './CounterOdometer';
import MagneticButton from './MagneticButton';
import Bee from './Bee';
import BeeAIShowcase from './BeeAIShowcase';
import type { BeeState } from '@/types/bee';
import './CreatorScreen.css';

interface CreatorScreenProps {
  count: number;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

interface CreatorStage {
  id: string;
  num: string;
  title: string;
  badge: string;
  desc: string;
  metrics: string[];
}

const CREATOR_STAGES: CreatorStage[] = [
  {
    id: 'connect',
    num: '01',
    title: 'CONNECT',
    badge: 'Instant Social Sync',
    desc: 'Link your TikTok, Instagram, and YouTube in 60 seconds. Bizele verifies your metrics into a live, shareable media kit.',
    metrics: ['Real-time follower & view verification', 'Demographic & geographic breakdown', 'Auto-generated vanity portfolio URL'],
  },
  {
    id: 'match',
    num: '02',
    title: 'MATCH',
    badge: 'Curated Inbound Deals',
    desc: 'Never send a cold pitch DM again. Our AI delivers pre-qualified sponsorship offers matched to your aesthetic and audience.',
    metrics: ['Zero cold pitching or generic spam', 'Direct brand budget visibility', 'Guaranteed brand-voice compatibility'],
  },
  {
    id: 'secure',
    num: '03',
    title: 'SECURE',
    badge: '100% Escrow Protection',
    desc: 'Brands lock 100% of the campaign payment into escrow before you ever record a single frame.',
    metrics: ['Funds safely locked prior to production', 'Clear, unambiguous creative brief', 'Standardized digital usage rights'],
  },
  {
    id: 'deliver',
    num: '04',
    title: 'DELIVER',
    badge: 'Instant Payout Release',
    desc: 'Upload your draft for brand approval. Once signed off, escrow funds release instantly — zero invoice chasing.',
    metrics: ['Immediate bank & Stripe deposits', 'Zero payment disputes or delays', 'Grow into recurring brand ambassador deals'],
  },
];

const FEATURES = [
  { icon: '📊', title: 'Live Smart Media Kit', desc: 'Connect TikTok, Instagram, and YouTube once. Follower counts, verified engagement, and demographics sync automatically. Share one sleek link.', metric: '100% always up-to-date' },
  { icon: '🎯', title: 'Algorithmic Brand Matching', desc: 'High-paying brands come directly to you. Our AI evaluates brand briefs against your niche and audience to deliver proposals that genuinely fit.', metric: '0 cold pitches sent' },
  { icon: '🔒', title: 'Guaranteed Escrow', desc: 'Never chase another invoice. Brands deposit 100% before you start. Once approved, funds release immediately.', metric: '0 days wait after approval' },
  { icon: '📈', title: 'AI Rate Card Intelligence', desc: 'Stop wondering if you\'re undercharging. Bizele benchmarks your engagement against real market rates so you get paid what you\'re worth.', metric: '+38% avg deal earnings' },
];

export default function CreatorScreen({ count, onJoinClick }: CreatorScreenProps) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [beeState, setBeeState] = useState<BeeState>('idle');
  const [beeMood, setBeeMood] = useState<'normal' | 'happy'>('normal');
  const beeContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance how-it-works
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % CREATOR_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentStage = CREATOR_STAGES[activeStage];

  const handleStageKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = (idx + 1) % CREATOR_STAGES.length;
      setActiveStage(next);
      setIsPaused(true);
    } else if (e.key === 'ArrowLeft') {
      const prev = (idx - 1 + CREATOR_STAGES.length) % CREATOR_STAGES.length;
      setActiveStage(prev);
      setIsPaused(true);
    }
  };

  return (
    <div className="creator-screen">
      {/* ========================================================
          HERO SECTION — CREATOR SPECIFIC
          ======================================================== */}
      <section className="hero creator-hero" id="hero">
        <div className="creator-hero__ambient" aria-hidden="true" />
        <div className="container creator-hero__container" data-network-calm>
          {/* Left Column: Proposition & CTA */}
          <div className="creator-hero__content">
            <div className="creator-hero__badge">
              <Bee className="creator-hero__bee-mascot" state="celebrating" mood="happy" wings="css" />
              <span className="creator-hero__badge-dot" />
              <span>Creator Early Access · Powered by BEE</span>
            </div>

            <h1 className="creator-hero__title">
              <span>Your Creativity.</span>
              <br />
              <span>Your Rates.</span>
              <br />
              <span className="creator-hero__title-accent">Direct Brand Deals.</span>
            </h1>

            <p className="creator-hero__subtitle">
              Connect with brands that match your audience. Get paid upfront via escrow — no pitch emails, no invoice chasing.
            </p>

            {/* Waitlist Proof & Action */}
            <div className="creator-hero__action-group">
              <div className="creator-hero__counter-card">
                <CounterOdometer
                  value={count}
                  label={count === 1 ? 'creator & brand on the waitlist' : 'creators & brands waiting for launch'}
                  showLiveBadge={true}
                />
              </div>

              <div className="creator-hero__cta-wrap">
                <MagneticButton
                  className="btn--primary btn--lg creator-hero__cta"
                  onClick={() => onJoinClick('creator')}
                  ariaLabel="Claim Your Creator Spot"
                >
                  Claim Your Creator Spot
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>
              </div>

              {/* Creator key guarantees */}
              <div className="creator-hero__highlights">
                <span className="creator-hero__highlight-pill">
                  <span className="creator-hero__pill-icon">🔒</span> Upfront Escrow
                </span>
                <span className="creator-hero__highlight-pill">
                  <span className="creator-hero__pill-icon">🎯</span> 100% Rate Control
                </span>
                <span className="creator-hero__highlight-pill">
                  <span className="creator-hero__pill-icon">⚡</span> Zero Pitch Spam
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: BEE AI Mascot Card */}
          <div className="creator-hero__visual" ref={beeContainerRef}>
            <div className="hero-bee-card">
              <div className="hero-bee-card__glow" aria-hidden="true" />
              <div
                className="hero-bee-card__avatar"
                onMouseEnter={() => { setBeeMood('happy'); setBeeState('celebrating'); }}
                onMouseLeave={() => { setBeeMood('normal'); setBeeState('idle'); }}
              >
                <Bee
                  className="hero-bee-card__svg"
                  state={beeState}
                  mood={beeMood}
                  wings="css"
                />
              </div>

              <div className="hero-bee-card__meta">
                <span className="hero-bee-card__label">Your Creator AI Copilot</span>
                <strong className="hero-bee-card__name">BEE v2.4 Neural Core</strong>
                <div className="hero-bee-card__status">
                  <span className="hero-bee-card__status-dot" />
                  <span>Active · Autonomous Partner</span>
                </div>
              </div>

              <div className="hero-bee-card__capabilities">
                <span className="hero-bee-card__cap-item">📊 Live Media Kit</span>
                <span className="hero-bee-card__cap-item">🎯 Brand Matching</span>
                <span className="hero-bee-card__cap-item">🔒 Escrow Deals</span>
                <span className="hero-bee-card__cap-item">💰 Fair Rate AI</span>
              </div>

              <button
                type="button"
                className="btn btn--primary btn--sm hero-bee-card__cta"
                onClick={() => {
                  const el = document.getElementById('bee-ai');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-no-network
              >
                Meet BEE →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BEE AI GROWTH PARTNER SHOWCASE (moved up)
          ======================================================== */}
      <BeeAIShowcase role="creator" onJoinClick={onJoinClick} />

      {/* ========================================================
          CREATOR FEATURES SUITE — COLLAPSED ACCORDION
          ======================================================== */}
      <section className="section section--dark creator-features" id="platform">
        <div className="container">
          <div className="creator-section-header">
            <span className="section__label">The Creator Monetization Suite</span>
            <h2 className="section__title">Everything to Run Your Creator Business</h2>
          </div>

          <div className="creator-features-accordion">
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                className={`creator-accordion-item ${expandedFeature === idx ? 'creator-accordion-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="creator-accordion-item__trigger"
                  onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
                  aria-expanded={expandedFeature === idx}
                  data-no-network
                >
                  <span className="creator-accordion-item__icon">{f.icon}</span>
                  <span className="creator-accordion-item__title">{f.title}</span>
                  <span className="creator-accordion-item__metric">{f.metric}</span>
                  <span className="creator-accordion-item__chevron" aria-hidden="true">
                    {expandedFeature === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFeature === idx && (
                  <div className="creator-accordion-item__body">
                    <p>{f.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS FOR CREATORS (4 STAGES)
          ======================================================== */}
      <section
        className="section creator-how"
        id="how-it-works"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container" data-network-calm>
          <div className="creator-section-header">
            <span className="section__label">4 Steps to Predictable Sponsorships</span>
            <h2 className="section__title">How Creators Win on Bizele</h2>
          </div>

          {/* Stepper Navigation */}
          <div className="creator-how__stepper" role="tablist" aria-label="Creator collaboration stages">
            {CREATOR_STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                role="tab"
                id={`creator-stage-${stage.id}`}
                aria-selected={activeStage === idx}
                tabIndex={activeStage === idx ? 0 : -1}
                className={`creator-how__step-btn ${activeStage === idx ? 'creator-how__step-btn--active' : ''}`}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPaused(true);
                }}
                onKeyDown={(e) => handleStageKeyDown(e, idx)}
              >
                <div className="creator-how__step-bar">
                  <span
                    className="creator-how__step-fill"
                    style={{
                      width: activeStage === idx ? '100%' : activeStage > idx ? '100%' : '0%',
                    }}
                  />
                </div>
                <div className="creator-how__step-meta">
                  <span className="creator-how__step-num">{stage.num}</span>
                  <span className="creator-how__step-title">{stage.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Stage Detail Panel (compact — no heavy visualizer) */}
          <div className="creator-how__detail-panel">
            <span className="creator-how__badge">{currentStage.badge}</span>
            <h3 className="creator-how__headline">
              Stage {currentStage.num}: {currentStage.title}
            </h3>
            <p className="creator-how__desc">{currentStage.desc}</p>
            <div className="creator-how__metrics">
              {currentStage.metrics.map((m) => (
                <div key={m} className="creator-how__metric-item">
                  <span className="creator-how__metric-dot" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CREATOR FINAL CTA
          ======================================================== */}
      <section className="creator-final-cta" id="join">
        <div className="container">
          <div className="creator-final-cta__card">
            <span className="creator-final-cta__pill">CREATOR ACCESS · WAVE ONE</span>
            <h2 className="creator-final-cta__title">
              Turn Your Influence Into A Predictable Business
            </h2>
            <p className="creator-final-cta__desc">
              Join creators ready to land high-paying sponsorships on their own terms. Claim your handle before public launch.
            </p>

            <div className="creator-final-cta__counter">
              <CounterOdometer
                value={count}
                label={count === 1 ? 'person currently on the waitlist' : 'creators & brands ready to connect'}
                showLiveBadge={false}
              />
            </div>

            <div className="creator-final-cta__actions">
              <MagneticButton
                className="btn--primary btn--lg creator-final-cta__btn"
                onClick={() => onJoinClick('creator')}
                ariaLabel="Join as Creator"
              >
                Join Creator Waitlist
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
