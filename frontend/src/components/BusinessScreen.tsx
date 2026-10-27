import { useState, useEffect, useRef } from 'react';
import CounterOdometer from './CounterOdometer';
import MagneticButton from './MagneticButton';
import Bee from './Bee';
import BeeAIShowcase from './BeeAIShowcase';
import type { BeeState } from '@/types/bee';
import './BusinessScreen.css';

interface BusinessScreenProps {
  count: number;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

interface BusinessStage {
  id: string;
  num: string;
  title: string;
  badge: string;
  desc: string;
  metrics: string[];
}

const BUSINESS_STAGES: BusinessStage[] = [
  {
    id: 'target',
    num: '01',
    title: 'TARGET',
    badge: 'Define ICP & Goals',
    desc: 'Input your product category, target customer demographics, and target ROAS into the intelligence engine.',
    metrics: ['Demographic & geo target filters', 'Deliverable templates & usage rights', 'Automated rate & budget benchmarking'],
  },
  {
    id: 'audit',
    num: '02',
    title: 'AUDIT',
    badge: 'AI Screening & Fraud Detection',
    desc: 'Our neural engine scans thousands of creators, filtering out phantom followers and ranks candidates by genuine audience synergy.',
    metrics: ['Forensic bot & fake follower audit', '98.4% brand-voice synergy match', 'Historic audience conversion analysis'],
  },
  {
    id: 'escrow',
    num: '03',
    title: 'ESCROW',
    badge: '1-Click Contracts & Security',
    desc: 'Execute standardized licensing agreements with built-in FTC compliance and escrow payment protection.',
    metrics: ['Standardized digital IP contracts', '100% money-back milestone escrow', 'Automated 1099 tax compliance'],
  },
  {
    id: 'attribution',
    num: '04',
    title: 'ATTRIBUTION',
    badge: 'Live Multi-Touch ROAS',
    desc: 'Track real-time clicks, coupon redemptions, and revenue by each creator. Scale top performers.',
    metrics: ['First-party click & sales tracking', 'Granular creator attribution dashboard', '1-click ambassador contract renewal'],
  },
];

const FEATURES = [
  { icon: '🛡️', title: 'Fraud & Bot Detection', desc: 'Neural auditing eliminates bot networks before contracts are sent. 24% of wasted ad spend prevented.', metric: '24% ad spend saved' },
  { icon: '🎯', title: 'AI Creator Matching', desc: 'Find creators whose audience matches your target buyer. Filter by category, tone alignment, and conversion probability.', metric: '98.4% compatibility avg' },
  { icon: '⚖️', title: 'Contracts & Escrow', desc: 'Digital usage rights, FTC compliance, and escrow protection built-in. Capital disbursed only on deliverable approval.', metric: '100% capital protected' },
  { icon: '📊', title: 'ROAS Attribution', desc: 'Connect creator campaigns directly to revenue. Track clicks, conversions, AOV, and customer lifetime value in real time.', metric: '4.18x avg blended ROAS' },
];

export default function BusinessScreen({ count, onJoinClick }: BusinessScreenProps) {
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
      setActiveStage((prev) => (prev + 1) % BUSINESS_STAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const currentStage = BUSINESS_STAGES[activeStage];

  const handleStageKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = (idx + 1) % BUSINESS_STAGES.length;
      setActiveStage(next);
      setIsPaused(true);
    } else if (e.key === 'ArrowLeft') {
      const prev = (idx - 1 + BUSINESS_STAGES.length) % BUSINESS_STAGES.length;
      setActiveStage(prev);
      setIsPaused(true);
    }
  };

  return (
    <div className="business-screen">
      {/* ========================================================
          HERO SECTION — BUSINESS / BRAND SPECIFIC
          ======================================================== */}
      <section className="hero business-hero" id="hero">
        <div className="business-hero__ambient" aria-hidden="true" />
        <div className="container business-hero__container" data-network-calm>
          {/* Left Column: Proposition & CTA */}
          <div className="business-hero__content">
            <div className="business-hero__badge">
              <Bee className="business-hero__bee-mascot" state="working" mood="happy" wings="css" />
              <span className="business-hero__badge-dot" />
              <span>Enterprise & Brand Cohort · Powered by BEE</span>
            </div>

            <h1 className="business-hero__title">
              <span>Find High-Converting Creators.</span>
              <br />
              <span>Scale Verifiable ROAS.</span>
              <br />
              <span className="business-hero__title-accent">Zero Bot Fraud.</span>
            </h1>

            <p className="business-hero__subtitle">
              AI-powered creator matching with automated contracts, escrow protection, and real-time ROAS attribution.
            </p>

            {/* Waitlist Proof & Action */}
            <div className="business-hero__action-group">
              <div className="business-hero__counter-card">
                <CounterOdometer
                  value={count}
                  label={count === 1 ? 'brand & creator on the waitlist' : 'brands & creators currently in queue'}
                  showLiveBadge={true}
                />
              </div>

              <div className="business-hero__cta-wrap">
                <MagneticButton
                  className="btn--primary btn--lg business-hero__cta"
                  onClick={() => onJoinClick('brand')}
                  ariaLabel="Request Brand Access"
                >
                  Request Brand Access
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </MagneticButton>
              </div>

              {/* Business key assurances */}
              <div className="business-hero__highlights">
                <span className="business-hero__highlight-pill">
                  <span className="business-hero__pill-icon">🛡️</span> 99.2% Fraud-Free
                </span>
                <span className="business-hero__highlight-pill">
                  <span className="business-hero__pill-icon">📊</span> Multi-Touch ROAS
                </span>
                <span className="business-hero__highlight-pill">
                  <span className="business-hero__pill-icon">⚖️</span> Escrow Protected
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: BEE AI Mascot Card */}
          <div className="business-hero__visual" ref={beeContainerRef}>
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
                <span className="hero-bee-card__label">Business Elevation Engine</span>
                <strong className="hero-bee-card__name">BEE v2.4 Neural Core</strong>
                <div className="hero-bee-card__status">
                  <span className="hero-bee-card__status-dot" />
                  <span>Active · Autonomous Partner</span>
                </div>
              </div>

              <div className="hero-bee-card__capabilities">
                <span className="hero-bee-card__cap-item">🚀 Campaign Creation</span>
                <span className="hero-bee-card__cap-item">🎯 Creator Matching</span>
                <span className="hero-bee-card__cap-item">📊 ROAS Attribution</span>
                <span className="hero-bee-card__cap-item">🛡️ Fraud Detection</span>
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
      <BeeAIShowcase role="business" onJoinClick={onJoinClick} />

      {/* ========================================================
          PLATFORM FEATURES — COLLAPSED ACCORDION
          ======================================================== */}
      <section className="section section--dark business-features" id="platform">
        <div className="container">
          <div className="business-section-header">
            <span className="section__label">The Enterprise Suite</span>
            <h2 className="section__title">Predictable, Data-Driven Creator Marketing</h2>
          </div>

          <div className="business-features-accordion">
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                className={`biz-accordion-item ${expandedFeature === idx ? 'biz-accordion-item--open' : ''}`}
              >
                <button
                  type="button"
                  className="biz-accordion-item__trigger"
                  onClick={() => setExpandedFeature(expandedFeature === idx ? null : idx)}
                  aria-expanded={expandedFeature === idx}
                  data-no-network
                >
                  <span className="biz-accordion-item__icon">{f.icon}</span>
                  <span className="biz-accordion-item__title">{f.title}</span>
                  <span className="biz-accordion-item__metric">{f.metric}</span>
                  <span className="biz-accordion-item__chevron" aria-hidden="true">
                    {expandedFeature === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFeature === idx && (
                  <div className="biz-accordion-item__body">
                    <p>{f.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW IT WORKS FOR BUSINESSES (4 STAGES)
          ======================================================== */}
      <section
        className="section business-how"
        id="how-it-works"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="container" data-network-calm>
          <div className="business-section-header">
            <span className="section__label">The 4-Stage Enterprise Pipeline</span>
            <h2 className="section__title">How High-Growth Brands Scale on Bizele</h2>
          </div>

          {/* Stepper Navigation */}
          <div className="business-how__stepper" role="tablist" aria-label="Enterprise campaign stages">
            {BUSINESS_STAGES.map((stage, idx) => (
              <button
                key={stage.id}
                role="tab"
                id={`business-stage-${stage.id}`}
                aria-selected={activeStage === idx}
                tabIndex={activeStage === idx ? 0 : -1}
                className={`business-how__step-btn ${activeStage === idx ? 'business-how__step-btn--active' : ''}`}
                onClick={() => {
                  setActiveStage(idx);
                  setIsPaused(true);
                }}
                onKeyDown={(e) => handleStageKeyDown(e, idx)}
              >
                <div className="business-how__step-bar">
                  <span
                    className="business-how__step-fill"
                    style={{
                      width: activeStage === idx ? '100%' : activeStage > idx ? '100%' : '0%',
                    }}
                  />
                </div>
                <div className="business-how__step-meta">
                  <span className="business-how__step-num">{stage.num}</span>
                  <span className="business-how__step-title">{stage.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Stage Detail Panel (compact — no heavy visualizer) */}
          <div className="business-how__detail-panel">
            <span className="business-how__badge">{currentStage.badge}</span>
            <h3 className="business-how__headline">
              Stage {currentStage.num}: {currentStage.title}
            </h3>
            <p className="business-how__desc">{currentStage.desc}</p>
            <div className="business-how__metrics">
              {currentStage.metrics.map((m) => (
                <div key={m} className="business-how__metric-item">
                  <span className="business-how__metric-dot" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BUSINESS FINAL CTA
          ======================================================== */}
      <section className="business-final-cta" id="join">
        <div className="container">
          <div className="business-final-cta__card">
            <span className="business-final-cta__pill">ENTERPRISE WAVE ONE · PRIORITY ALLOCATION</span>
            <h2 className="business-final-cta__title">
              Transform Influencer Marketing Into A Predictable Revenue Channel
            </h2>
            <p className="business-final-cta__desc">
              Join forward-thinking D2C brands and growth agencies. Claim priority onboarding before public launch.
            </p>

            <div className="business-final-cta__counter">
              <CounterOdometer
                value={count}
                label={count === 1 ? 'person currently on the waitlist' : 'brands & creators in the queue'}
                showLiveBadge={false}
              />
            </div>

            <div className="business-final-cta__actions">
              <MagneticButton
                className="btn--primary btn--lg business-final-cta__btn"
                onClick={() => onJoinClick('brand')}
                ariaLabel="Request Brand Access"
              >
                Request Brand Access
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
