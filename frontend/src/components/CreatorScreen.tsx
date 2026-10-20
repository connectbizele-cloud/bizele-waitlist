import { useState, useEffect } from 'react';
import CounterOdometer from './CounterOdometer';
import MagneticButton from './MagneticButton';
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
    desc: 'Link your TikTok, Instagram, and YouTube in 60 seconds. Bizele verifies your metrics, engagement rate, and audience demographics into a live, shareable media kit.',
    metrics: ['Real-time follower & view verification', 'Demographic & geographic breakdown', 'Auto-generated vanity portfolio URL'],
  },
  {
    id: 'match',
    num: '02',
    title: 'MATCH',
    badge: 'Curated Inbound Deals',
    desc: 'Never send a cold pitch DM again. Our AI analyzes brand campaign briefs against your aesthetic, tone, and audience affinity to deliver pre-qualified sponsorship offers.',
    metrics: ['Zero cold pitching or generic spam', 'Direct brand budget visibility', 'Guaranteed brand-voice compatibility'],
  },
  {
    id: 'secure',
    num: '03',
    title: 'SECURE',
    badge: '100% Escrow Protection',
    desc: 'Review standardized briefs with complete clarity on deliverables. Brands lock 100% of the campaign payment into escrow before you ever record a single frame.',
    metrics: ['Funds safely locked prior to production', 'Clear, unambiguous creative brief', 'Standardized digital usage rights'],
  },
  {
    id: 'deliver',
    num: '04',
    title: 'DELIVER',
    badge: 'Instant Payout Release',
    desc: 'Upload your draft for quick brand approval. Once signed off, escrow funds release instantly to your bank account with zero invoice chasing or 90-day net delays.',
    metrics: ['Immediate bank & Stripe deposits', 'Zero payment disputes or delays', 'Grow into recurring brand ambassador deals'],
  },
];

export default function CreatorScreen({ count, onJoinClick }: CreatorScreenProps) {
  // Hero interactive card tab: 'mediakit' | 'deal'
  const [heroTab, setHeroTab] = useState<'mediakit' | 'deal'>('mediakit');

  // How It Works interactive stage
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance preview when not hovered
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
        <div className="container creator-hero__container">
          {/* Left Column: Proposition & CTA */}
          <div className="creator-hero__content">
            <div className="creator-hero__badge">
              <span className="creator-hero__badge-dot" />
              <span>Creator Early Access · Wave One</span>
            </div>

            <h1 className="creator-hero__title">
              <span>Your Creativity.</span>
              <br />
              <span>Your Rates.</span>
              <br />
              <span className="creator-hero__title-accent">Direct Brand Deals.</span>
            </h1>

            <p className="creator-hero__subtitle">
              Stop sending cold pitch emails that get ignored. Bizele connects your verified portfolio
              directly with brands looking for your exact audience — backed by upfront escrow payouts.
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

          {/* Right Column: Interactive Live Creator Media Kit & Inbound Deal Preview */}
          <div className="creator-hero__visual">
            <div className="creator-card" role="region" aria-label="Interactive Creator Studio Preview">
              {/* Card Header & Switcher */}
              <div className="creator-card__nav">
                <button
                  type="button"
                  className={`creator-card__tab ${heroTab === 'mediakit' ? 'creator-card__tab--active' : ''}`}
                  onClick={() => setHeroTab('mediakit')}
                >
                  📊 Live Media Kit
                </button>
                <button
                  type="button"
                  className={`creator-card__tab ${heroTab === 'deal' ? 'creator-card__tab--active' : ''}`}
                  onClick={() => setHeroTab('deal')}
                >
                  💼 Inbound Deal Offer <span className="creator-card__tab-badge">New</span>
                </button>
              </div>

              {/* Tab 1: Live Media Kit */}
              {heroTab === 'mediakit' && (
                <div className="creator-card__body">
                  <div className="creator-profile">
                    <div className="creator-profile__avatar">
                      <span className="creator-profile__initials">ML</span>
                      <span className="creator-profile__status-dot" title="Available for campaigns" />
                    </div>
                    <div className="creator-profile__info">
                      <div className="creator-profile__name-row">
                        <strong className="creator-profile__name">Maya Lin</strong>
                        <span className="creator-profile__badge">Verified Creator ✓</span>
                      </div>
                      <span className="creator-profile__handle">@mayacreates · Tech & Design</span>
                    </div>
                  </div>

                  <div className="creator-stats-grid">
                    <div className="creator-stat-box">
                      <span className="creator-stat-box__label">Total Audience</span>
                      <strong className="creator-stat-box__val">184.5K</strong>
                      <span className="creator-stat-box__meta">Across 3 platforms</span>
                    </div>
                    <div className="creator-stat-box">
                      <span className="creator-stat-box__label">Avg. Engagement</span>
                      <strong className="creator-stat-box__val creator-stat-box__val--accent">5.8%</strong>
                      <span className="creator-stat-box__meta">3.2x niche avg</span>
                    </div>
                    <div className="creator-stat-box">
                      <span className="creator-stat-box__label">Authenticity</span>
                      <strong className="creator-stat-box__val">94.2%</strong>
                      <span className="creator-stat-box__meta">AI fraud verified</span>
                    </div>
                    <div className="creator-stat-box">
                      <span className="creator-stat-box__label">Avg. Deal Rate</span>
                      <strong className="creator-stat-box__val">$2,400</strong>
                      <span className="creator-stat-box__meta">Fair benchmark</span>
                    </div>
                  </div>

                  {/* Channel Breakdown */}
                  <div className="creator-channels">
                    <span className="creator-channels__title">Connected Channels (Auto-Synced)</span>
                    <div className="creator-channels__row">
                      <div className="creator-channel-chip">
                        <span className="creator-channel-chip__icon">📱</span>
                        <span>TikTok</span>
                        <strong>89.2K</strong>
                      </div>
                      <div className="creator-channel-chip">
                        <span className="creator-channel-chip__icon">📸</span>
                        <span>Instagram</span>
                        <strong>76.0K</strong>
                      </div>
                      <div className="creator-channel-chip">
                        <span className="creator-channel-chip__icon">▶️</span>
                        <span>YouTube</span>
                        <strong>19.3K</strong>
                      </div>
                    </div>
                  </div>

                  <div className="creator-card__footer">
                    <span className="creator-card__share-hint">🔗 bizele.com/@mayacreates</span>
                    <button
                      type="button"
                      className="creator-card__btn"
                      onClick={() => onJoinClick('creator')}
                    >
                      Build Your Kit →
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Inbound Deal Offer */}
              {heroTab === 'deal' && (
                <div className="creator-card__body">
                  <div className="creator-deal">
                    <div className="creator-deal__header">
                      <div className="creator-deal__brand">
                        <span className="creator-deal__brand-icon">🎧</span>
                        <div>
                          <strong>Aura Acoustics</strong>
                          <span className="creator-deal__brand-status">Direct Inbound Match</span>
                        </div>
                      </div>
                      <div className="creator-deal__payout">
                        <span className="creator-deal__payout-label">Offer Amount</span>
                        <strong className="creator-deal__payout-val">$2,850</strong>
                      </div>
                    </div>

                    <div className="creator-deal__brief">
                      <div className="creator-deal__detail-row">
                        <span className="creator-deal__detail-label">Campaign</span>
                        <span className="creator-deal__detail-val">Studio ANC Wireless Headphones</span>
                      </div>
                      <div className="creator-deal__detail-row">
                        <span className="creator-deal__detail-label">Deliverables</span>
                        <span className="creator-deal__detail-val">1x Dedicated 60s Reel + 2x Story Links</span>
                      </div>
                      <div className="creator-deal__detail-row">
                        <span className="creator-deal__detail-label">Synergy Score</span>
                        <span className="creator-deal__detail-val creator-deal__detail-val--match">98.4% Audience Match</span>
                      </div>
                    </div>

                    <div className="creator-deal__escrow-banner">
                      <span className="creator-deal__escrow-icon">🔒</span>
                      <div>
                        <strong>$2,850.00 Secured in Escrow</strong>
                        <p>Funds are deposited and guaranteed before you film.</p>
                      </div>
                    </div>

                    <div className="creator-deal__actions">
                      <button
                        type="button"
                        className="btn btn--primary btn--sm creator-deal__btn"
                        onClick={() => onJoinClick('creator')}
                      >
                        Accept Deal & Claim Spot
                      </button>
                      <button
                        type="button"
                        className="btn btn--secondary btn--sm creator-deal__btn-sec"
                        onClick={() => onJoinClick('creator')}
                      >
                        Customize Terms
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CREATOR FEATURES SUITE — THE MONETIZATION ENGINE
          ======================================================== */}
      <section className="section section--dark creator-features" id="platform">
        <div className="container">
          <div className="creator-section-header">
            <span className="section__label">The Creator Monetization Suite</span>
            <h2 className="section__title">Everything You Need to Run Your Creator Business</h2>
            <p className="creator-section-header__sub">
              No more messy spreadsheets, ghosted emails, or delayed invoices. Run your entire brand partnership pipeline on one intelligent platform.
            </p>
          </div>

          <div className="creator-features__grid">
            {/* Feature 1 */}
            <div className="creator-feat-card">
              <div className="creator-feat-card__top">
                <span className="creator-feat-card__icon">📊</span>
                <span className="creator-feat-card__tag">Automated Portfolio</span>
              </div>
              <h3 className="creator-feat-card__title">Live Smart Media Kit</h3>
              <p className="creator-feat-card__desc">
                Connect your TikTok, Instagram, and YouTube once. Your follower counts, verified engagement, and demographic breakdown sync automatically in real time. Share a single sleek link with prospective sponsors.
              </p>
              <div className="creator-feat-card__metric">
                <span className="creator-feat-card__metric-val">100%</span>
                <span className="creator-feat-card__metric-lbl">Always-up-to-date metrics</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="creator-feat-card">
              <div className="creator-feat-card__top">
                <span className="creator-feat-card__icon">🎯</span>
                <span className="creator-feat-card__tag">Inbound Sponsorships</span>
              </div>
              <h3 className="creator-feat-card__title">Algorithmic Brand Matching</h3>
              <p className="creator-feat-card__desc">
                High-paying brands come directly to you. Our AI evaluates brand briefs against your niche, aesthetic, and follower affinity to deliver proposals that genuinely make sense for your community.
              </p>
              <div className="creator-feat-card__metric">
                <span className="creator-feat-card__metric-val">0</span>
                <span className="creator-feat-card__metric-lbl">Cold pitch emails sent</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="creator-feat-card">
              <div className="creator-feat-card__top">
                <span className="creator-feat-card__icon">🔒</span>
                <span className="creator-feat-card__tag">Payment Security</span>
              </div>
              <h3 className="creator-feat-card__title">Guaranteed Escrow Protection</h3>
              <p className="creator-feat-card__desc">
                Never chase another invoice. Brands deposit 100% of the campaign payment into escrow before you start producing content. Once deliverables are approved, funds release immediately to your account.
              </p>
              <div className="creator-feat-card__metric">
                <span className="creator-feat-card__metric-val">0 Days</span>
                <span className="creator-feat-card__metric-lbl">Wait time after approval</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="creator-feat-card">
              <div className="creator-feat-card__top">
                <span className="creator-feat-card__icon">📈</span>
                <span className="creator-feat-card__tag">Fair-Market Pricing</span>
              </div>
              <h3 className="creator-feat-card__title">AI Rate Card Intelligence</h3>
              <p className="creator-feat-card__desc">
                Stop wondering if you're undercharging. Bizele benchmarks your engagement velocity and audience purchasing power against real market sponsorship rates to ensure you get paid what you're truly worth.
              </p>
              <div className="creator-feat-card__metric">
                <span className="creator-feat-card__metric-val">+38%</span>
                <span className="creator-feat-card__metric-lbl">Avg. increase in creator deal earnings</span>
              </div>
            </div>
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
        <div className="container">
          <div className="creator-section-header">
            <span className="section__label">4 Steps to Predictable Sponsorships</span>
            <h2 className="section__title">How Creators Win on Bizele</h2>
            <p className="creator-section-header__sub">
              A transparent, hassle-free path designed to turn your creative talent into a predictable income stream.
            </p>
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

          {/* Dynamic Stage Interactive Visualizer */}
          <div className="creator-how__display">
            {/* Left: Content Details */}
            <div className="creator-how__content">
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

            {/* Right: Visualizer Graphic */}
            <div className="creator-how__visual" aria-hidden="true">
              <div className="creator-how__visual-box">
                {/* Stage 1: CONNECT */}
                {activeStage === 0 && (
                  <div className="stage-vis stage-vis--connect">
                    <div className="stage-vis__social-sync">
                      <div className="stage-vis__sync-item">
                        <span className="stage-vis__sync-icon">📱</span>
                        <span>TikTok Synced</span>
                        <span className="stage-vis__sync-check">✓</span>
                      </div>
                      <div className="stage-vis__sync-item">
                        <span className="stage-vis__sync-icon">📸</span>
                        <span>Instagram Synced</span>
                        <span className="stage-vis__sync-check">✓</span>
                      </div>
                      <div className="stage-vis__sync-item">
                        <span className="stage-vis__sync-icon">▶️</span>
                        <span>YouTube Synced</span>
                        <span className="stage-vis__sync-check">✓</span>
                      </div>
                    </div>
                    <div className="stage-vis__kit-ready">
                      <span>✨ Live Media Kit Generated · 184.5K Reach</span>
                    </div>
                  </div>
                )}

                {/* Stage 2: MATCH */}
                {activeStage === 1 && (
                  <div className="stage-vis stage-vis--match">
                    <div className="stage-vis__match-pill">
                      <span>🎯 98.4% Affinity Match</span>
                    </div>
                    <div className="stage-vis__match-box">
                      <div className="stage-vis__match-brand">
                        <span>🏢 Premium Brand</span>
                        <strong>$2,850 Campaign Offer</strong>
                      </div>
                      <div className="stage-vis__match-arrow">➔</div>
                      <div className="stage-vis__match-creator">
                        <span>🎨 Your Profile</span>
                        <strong>Target Niche Fit</strong>
                      </div>
                    </div>
                    <span className="stage-vis__tagline">Direct invitation delivered to your inbox</span>
                  </div>
                )}

                {/* Stage 3: SECURE */}
                {activeStage === 2 && (
                  <div className="stage-vis stage-vis--secure">
                    <div className="stage-vis__escrow-card">
                      <div className="stage-vis__lock-icon">🔒</div>
                      <div className="stage-vis__escrow-info">
                        <strong>$2,850.00 Deposited in Escrow</strong>
                        <span>Funds guaranteed before content creation begins</span>
                      </div>
                      <div className="stage-vis__brief-chip">Clear Brief Approved ✓</div>
                    </div>
                  </div>
                )}

                {/* Stage 4: DELIVER */}
                {activeStage === 3 && (
                  <div className="stage-vis stage-vis--deliver">
                    <div className="stage-vis__payout-card">
                      <span className="stage-vis__payout-badge">Payment Released</span>
                      <strong className="stage-vis__payout-val">+$2,850.00</strong>
                      <span className="stage-vis__payout-dest">Deposited to Connected Bank Account</span>
                      <div className="stage-vis__payout-footer">
                        <span>0 Days Wait · 0 Invoice Chasing</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CREATOR EARLY ACCESS PERKS
          ======================================================== */}
      <section className="section section--dark creator-perks">
        <div className="container">
          <div className="creator-section-header">
            <span className="section__label">Early Access Privileges</span>
            <h2 className="section__title">Why Join Wave One as a Creator?</h2>
            <p className="creator-section-header__sub">
              Founding creators receive special status, zero fees, and direct input into platform tools.
            </p>
          </div>

          <div className="creator-perks__grid">
            <div className="creator-perk-card">
              <span className="creator-perk-card__icon">🎁</span>
              <h3 className="creator-perk-card__title">0% Platform Fee</h3>
              <p className="creator-perk-card__desc">
                Keep 100% of your earnings on your first 3 completed brand campaigns. No hidden deductions or surprise processing fees.
              </p>
            </div>

            <div className="creator-perk-card">
              <span className="creator-perk-card__icon">⭐</span>
              <h3 className="creator-perk-card__title">Founding Verified Badge</h3>
              <p className="creator-perk-card__desc">
                Permanently featured with a verified founding badge on your public media kit and ranked with priority in brand search filters.
              </p>
            </div>

            <div className="creator-perk-card">
              <span className="creator-perk-card__icon">🤝</span>
              <h3 className="creator-perk-card__title">Creator Advisory Circle</h3>
              <p className="creator-perk-card__desc">
                Direct access to our founding product team. Request feature additions and shape the monetization tools built for your workflows.
              </p>
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
              Join the growing list of creators ready to land high-paying sponsorships on their own terms. Claim your handle before public launch.
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
