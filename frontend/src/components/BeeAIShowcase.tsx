import { useState, useRef, useEffect } from 'react';
import Bee from './Bee';
import type { BeeState } from '@/types/bee';
import type { Role } from '@/lib/role';
import MagneticButton from './MagneticButton';
import './BeeAIShowcase.css';

interface BeeAIShowcaseProps {
  role?: Role | null;
  onJoinClick: (userType?: 'creator' | 'brand') => void;
}

type PillarId = 'campaign' | 'matching' | 'crm' | 'performance' | 'assistant';

interface Pillar {
  id: PillarId;
  icon: string;
  badge: string;
  title: string;
  tagline: string;
  summary: string;
  features: { title: string; desc: string }[];
}

const PILLARS: Pillar[] = [
  {
    id: 'campaign',
    icon: '🚀',
    badge: '01 · Autonomous Launch',
    title: 'Campaign Creation & Launch',
    tagline: 'From brief to launched campaign in under 3 minutes.',
    summary:
      'BEE handles ideation, drafting, and creator briefs in your exact brand tone, then schedules deadlines so nothing slips.',
    features: [
      {
        title: 'Idea Generation',
        desc: 'Generates creative concepts, hooks, and angles tuned to your industry, goals, and target audience.',
      },
      {
        title: 'Full Campaign Builder',
        desc: 'Transforms a simple brief into objective, deliverables, timeline milestones, and budget allocation.',
      },
      {
        title: 'Creator Briefs & Copy',
        desc: 'Drafts bespoke creator briefs, outreach pitches, captions, and ad scripts with zero writer’s block.',
      },
      {
        title: 'Launch Milestones',
        desc: 'Sets automated schedule reminders, tracks deliverables, and alerts both sides to meet deadlines.',
      },
    ],
  },
  {
    id: 'matching',
    icon: '🎯',
    badge: '02 · Recommendation Engine',
    title: 'Brand & Creator Matching',
    tagline: 'Precision compatibility powered by real performance data.',
    summary:
      'No cold browsing. BEE matches brands and creators based on genuine demographic overlap, engagement quality, and budget fit.',
    features: [
      {
        title: 'Smart Recommendations',
        desc: 'Recommends creators by niche, audience verification, engagement depth, content style, and location.',
      },
      {
        title: 'Compatibility Match Scores',
        desc: 'Every match includes an explainable score with clear rationale so you know why the partnership works.',
      },
      {
        title: 'Budget-Fit Optimization',
        desc: 'Pairs creators specifically matched to your budget tier whether driving sales, awareness, or app installs.',
      },
      {
        title: 'Continuous Learning',
        desc: 'As campaigns run, BEE continuously refines matches based on verified conversion outcomes.',
      },
    ],
  },
  {
    id: 'crm',
    icon: '📈',
    badge: '03 · Relationship Suite',
    title: 'Business Growth Tools & CRM',
    tagline: 'Frictionless collaboration without spreadsheet chaos.',
    summary:
      'BEE tracks conversations, schedules calendar bookings, drafts follow-ups, and benchmarks fair market rates.',
    features: [
      {
        title: 'Relationship Pipeline',
        desc: 'Maintains full deal stages from initial outreach through signed escrow contracts.',
      },
      {
        title: 'Zero-Back-and-Forth Scheduling',
        desc: 'Finds mutually agreeable times and books sync calls between brands and creators automatically.',
      },
      {
        title: 'Automated Smart Nudges',
        desc: 'Detects stalled negotiations, drafts polite follow-ups, and keeps high-value deals moving.',
      },
      {
        title: 'Market Benchmark Pricing',
        desc: 'Advises fair deliverable pricing based on real market compensation data and audience engagement.',
      },
    ],
  },
  {
    id: 'performance',
    icon: '📊',
    badge: '04 · Plain-Language Telemetry',
    title: 'Performance Insights & Optimization',
    tagline: 'Turn vanity impressions into verifiable revenue.',
    summary:
      'Real-time plain-language summaries tell you what is working, what to tweak mid-flight, and which creators to scale.',
    features: [
      {
        title: 'Plain-Language Analytics',
        desc: 'Reach, engagement, clicks, and conversions translated into clear business insights.',
      },
      {
        title: 'Mid-Campaign Interventions',
        desc: 'Recommends tactical shifts like optimal posting times, format adjustments, and budget re-allocation.',
      },
      {
        title: 'Post-Campaign ROI Reports',
        desc: 'Auto-generates clean executive summaries with ROI calculations and actionable future learnings.',
      },
      {
        title: 'Ambassador Scaling',
        desc: 'Identifies top ROAS creators and offers 1-click recurring partnership contract renewals.',
      },
    ],
  },
  {
    id: 'assistant',
    icon: '💡',
    badge: '05 · Platform Copilot',
    title: 'Everyday Growth Assistant',
    tagline: 'Your 24/7 copilot for influencer marketing.',
    summary:
      'BEE guides your onboarding, audits creator media kits, answers platform questions, and protects against fraud.',
    features: [
      {
        title: 'Instant Platform Answers',
        desc: 'Answers questions about contracts, escrow, deliverables, and analytics instantly.',
      },
      {
        title: 'Onboarding Guidance',
        desc: 'Personalized step-by-step guidance for new brands and creators to launch their first campaign.',
      },
      {
        title: 'Media Kit Optimization',
        desc: 'Helps creators craft compelling profile descriptions and highlight their best-performing case studies.',
      },
      {
        title: 'Fraud & Risk Shield',
        desc: 'Pre-screens for fake engagement, comment pods, and sudden demographic anomalies before deals close.',
      },
    ],
  },
];

export default function BeeAIShowcase({ role = null, onJoinClick }: BeeAIShowcaseProps) {
  const [activePillar, setActivePillar] = useState<PillarId>('campaign');
  const [beeState, setBeeState] = useState<BeeState>('idle');
  const [beeMood, setBeeMood] = useState<'normal' | 'happy'>('normal');
  const [eyeLook, setEyeLook] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check if tabs can scroll left or right
  const updateScrollArrows = () => {
    const el = tabsRef.current;
    if (!el) return;
    const canScrollL = el.scrollLeft > 6;
    const canScrollR = el.scrollLeft < el.scrollWidth - el.clientWidth - 6;
    setShowLeftArrow(canScrollL);
    setShowRightArrow(canScrollR);
  };

  useEffect(() => {
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows);
    return () => window.removeEventListener('resize', updateScrollArrows);
  }, []);

  // Track eye movement toward cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamp glance between -3 and 3 px
      setEyeLook({
        x: Math.max(-3, Math.min(3, deltaX * 3)),
        y: Math.max(-2.5, Math.min(2.5, deltaY * 2.5)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smoothly scroll the tabs row so the next option comes into frame (or previous on return)
  const scrollToPillar = (targetId: PillarId, fromId: PillarId) => {
    const container = tabsRef.current;
    if (!container) return;

    const fromIdx = PILLARS.findIndex((p) => p.id === fromId);
    const targetIdx = PILLARS.findIndex((p) => p.id === targetId);
    if (targetIdx === -1) return;

    const clickedTab = tabButtonRefs.current[targetIdx];
    if (!clickedTab) return;

    const isForward = targetIdx >= fromIdx;
    const containerWidth = container.clientWidth;
    const currentScroll = container.scrollLeft;

    if (isForward) {
      // Forward: ensure the NEXT tab (targetIdx + 1) comes into frame
      const nextIdx = targetIdx + 1;
      const nextTab = nextIdx < PILLARS.length ? tabButtonRefs.current[nextIdx] : null;

      if (nextTab) {
        const nextRight = nextTab.offsetLeft + nextTab.offsetWidth;
        const visibleRight = currentScroll + containerWidth;

        if (nextRight > visibleRight - 16) {
          const targetScroll = nextRight - containerWidth + 24;
          const maxAllowedScroll = Math.max(0, clickedTab.offsetLeft - 12);
          container.scrollTo({
            left: Math.min(targetScroll, maxAllowedScroll),
            behavior: 'smooth',
          });
        } else if (clickedTab.offsetLeft < currentScroll + 12) {
          container.scrollTo({
            left: Math.max(0, clickedTab.offsetLeft - 16),
            behavior: 'smooth',
          });
        }
      } else {
        // Last tab: ensure fully visible at the end
        const clickedRight = clickedTab.offsetLeft + clickedTab.offsetWidth;
        if (clickedRight > currentScroll + containerWidth) {
          container.scrollTo({
            left: clickedRight - containerWidth + 16,
            behavior: 'smooth',
          });
        }
      }
    } else {
      // Backward: ensure the PREVIOUS tab (targetIdx - 1) comes into frame
      const prevIdx = targetIdx - 1;
      const prevTab = prevIdx >= 0 ? tabButtonRefs.current[prevIdx] : null;

      if (prevTab) {
        if (prevTab.offsetLeft < currentScroll + 16) {
          const targetScroll = Math.max(0, prevTab.offsetLeft - 24);
          const clickedRight = clickedTab.offsetLeft + clickedTab.offsetWidth;
          const minAllowedScroll = Math.max(0, clickedRight - containerWidth + 12);
          container.scrollTo({
            left: Math.max(targetScroll, minAllowedScroll),
            behavior: 'smooth',
          });
        } else {
          const clickedRight = clickedTab.offsetLeft + clickedTab.offsetWidth;
          if (clickedRight > currentScroll + containerWidth) {
            container.scrollTo({
              left: clickedRight - containerWidth + 16,
              behavior: 'smooth',
            });
          }
        }
      } else {
        // First tab: scroll back to start
        container.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    }

    setTimeout(updateScrollArrows, 350);
  };

  const handlePillarChange = (id: PillarId) => {
    const prevId = activePillar;
    setActivePillar(id);
    setBeeState('working');
    setBeeMood('happy');

    // Auto-scroll next/previous option into frame
    scrollToPillar(id, prevId);

    // Trigger subtle pulse ripple
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent('bizele:pulse', {
          detail: { x: rect.left + rect.width / 2, y: rect.top + 100 },
        })
      );
    }

    setTimeout(() => {
      setBeeState('celebrating');
    }, 450);

    setTimeout(() => {
      setBeeState('idle');
      setBeeMood('normal');
    }, 1800);
  };

  const handleArrowStep = (direction: 'prev' | 'next') => {
    const currentIdx = PILLARS.findIndex((p) => p.id === activePillar);
    if (direction === 'next' && currentIdx < PILLARS.length - 1) {
      handlePillarChange(PILLARS[currentIdx + 1].id);
    } else if (direction === 'prev' && currentIdx > 0) {
      handlePillarChange(PILLARS[currentIdx - 1].id);
    } else {
      const el = tabsRef.current;
      if (!el) return;
      el.scrollBy({
        left: direction === 'next' ? 220 : -220,
        behavior: 'smooth',
      });
      setTimeout(updateScrollArrows, 300);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (idx + 1) % PILLARS.length;
      handlePillarChange(PILLARS[nextIdx].id);
      tabButtonRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (idx - 1 + PILLARS.length) % PILLARS.length;
      handlePillarChange(PILLARS[prevIdx].id);
      tabButtonRefs.current[prevIdx]?.focus();
    }
  };

  const currentPillarIdx = PILLARS.findIndex((p) => p.id === activePillar);
  const currentPillar = PILLARS[currentPillarIdx] || PILLARS[0];
  const mappedUserType = role === 'creator' ? 'creator' : 'brand';

  return (
    <section className="section bee-showcase-section" id="bee-ai" ref={containerRef}>
      <div className="container" data-network-calm>
        {/* Section Header */}
        <div className="bee-showcase__header">
          <div className="bee-showcase__badge">
            <span className="bee-showcase__badge-dot" />
            <span>AI Core Architecture · Meet BEE</span>
          </div>
          <h2 className="bee-showcase__title">
            BEE: Bizele’s AI Growth Partner
          </h2>
          <p className="bee-showcase__subtitle">
            Think of BEE as a mix of HubSpot’s marketing automation, Calendly’s frictionless scheduling, and a senior creative strategist — handling the planning, matching, and optimizing that usually takes an entire marketing department.
          </p>
        </div>

        {/* Central Mascot & Interactive Stage */}
        <div className="bee-showcase__stage">
          {/* Mascot Interactive Deck */}
          <div className="bee-mascot-card">
            <div className="bee-mascot-card__glow" aria-hidden="true" />
            <div
              className="bee-mascot-card__avatar-wrap"
              onMouseEnter={() => {
                setBeeMood('happy');
                setBeeState('celebrating');
              }}
              onMouseLeave={() => {
                setBeeMood('normal');
                setBeeState('idle');
              }}
            >
              <Bee
                className="bee-mascot-card__svg"
                state={beeState}
                mood={beeMood}
                look={eyeLook}
                wings="css"
              />
            </div>

            <div className="bee-mascot-card__meta">
              <span className="bee-mascot-card__label">Business Elevation Engine</span>
              <strong className="bee-mascot-card__name">BEE v2.4 Neural Core</strong>
              <div className="bee-mascot-card__status">
                <span className="bee-mascot-card__status-dot" />
                <span>
                  {beeState === 'working'
                    ? 'Processing Live Campaign...'
                    : beeState === 'celebrating'
                    ? 'Synergy Optimized!'
                    : 'Active · Autonomous Partner'}
                </span>
              </div>
            </div>

            <div className="bee-mascot-card__pitch">
              “BEE takes the guesswork out of influencer and brand marketing by helping businesses plan smarter campaigns, find the right creators, and grow faster, all from one platform.”
            </div>

            <div className="bee-mascot-card__cta">
              <MagneticButton
                className="btn btn--primary btn--sm bee-mascot-card__btn"
                onClick={() => onJoinClick(mappedUserType)}
                ariaLabel="Experience BEE in Early Access"
                data-no-network
              >
                Join Early Access
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </MagneticButton>
            </div>
          </div>

          {/* Interactive Pillars Navigation & Live Demo */}
          <div className="bee-interactive-deck">
            {/* Tabs */}
            <div className="bee-tabs-wrapper">
              {showLeftArrow && (
                <button
                  type="button"
                  className="bee-tabs-arrow bee-tabs-arrow--left"
                  onClick={() => handleArrowStep('prev')}
                  aria-label="Previous capabilities"
                  data-no-network
                >
                  ‹
                </button>
              )}
              <div
                className="bee-tabs"
                role="tablist"
                aria-label="BEE Capabilities"
                ref={tabsRef}
                onScroll={updateScrollArrows}
              >
                {PILLARS.map((p, idx) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabButtonRefs.current[idx] = el;
                    }}
                    role="tab"
                    id={`tab-${p.id}`}
                    aria-selected={activePillar === p.id}
                    tabIndex={activePillar === p.id ? 0 : -1}
                    className={`bee-tab ${activePillar === p.id ? 'bee-tab--active' : ''}`}
                    onClick={() => handlePillarChange(p.id)}
                    onKeyDown={(e) => handleTabKeyDown(e, idx)}
                    data-no-network
                  >
                    <span className="bee-tab__icon">{p.icon}</span>
                    <span className="bee-tab__title">{p.title}</span>
                  </button>
                ))}
              </div>
              {showRightArrow && (
                <button
                  type="button"
                  className="bee-tabs-arrow bee-tabs-arrow--right"
                  onClick={() => handleArrowStep('next')}
                  aria-label="Next capabilities"
                  data-no-network
                >
                  ›
                </button>
              )}
            </div>

            {/* Active Pillar Card */}
            <div className="bee-pillar-panel" role="tabpanel" aria-labelledby={`tab-${currentPillar.id}`}>
              <div className="bee-pillar-panel__header">
                <div>
                  <span className="bee-pillar-panel__badge">{currentPillar.badge}</span>
                  <h3 className="bee-pillar-panel__title">{currentPillar.title}</h3>
                  <p className="bee-pillar-panel__tagline">{currentPillar.tagline}</p>
                </div>
                <div className="bee-pillar-panel__icon-box" aria-hidden="true">
                  {currentPillar.icon}
                </div>
              </div>

              {/* 4 Feature Sub-cards */}
              <div className="bee-features-grid">
                {currentPillar.features.map((f, i) => (
                  <div key={i} className="bee-feature-card">
                    <span className="bee-feature-card__bullet">✓</span>
                    <div>
                      <strong className="bee-feature-card__title">{f.title}</strong>
                      <p className="bee-feature-card__desc">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Simulation Preview Box */}
              <div className="bee-simulation-box">
                <div className="bee-simulation-box__top">
                  <span className="bee-simulation-box__dot" />
                  <span className="bee-simulation-box__dot" />
                  <span className="bee-simulation-box__dot" />
                  <span className="bee-simulation-box__title">BEE Live Simulation · {currentPillar.title}</span>
                </div>

                <div className="bee-simulation-box__body">
                  {/* Pillar 1: Campaign */}
                  {activePillar === 'campaign' && (
                    <div className="bee-sim bee-sim--campaign">
                      <div className="bee-sim__prompt">
                        <span className="bee-sim__tag">Brief Input</span>
                        <p>“Launch an organic D2C coffee brand focused on productivity, $15k budget, targeting tech creators.”</p>
                      </div>
                      <div className="bee-sim__response">
                        <div className="bee-sim__response-header">
                          <span className="bee-sim__bee-icon">🐝</span>
                          <strong>BEE Campaign Blueprint Generated (0.8s)</strong>
                        </div>
                        <ul className="bee-sim__checklist">
                          <li><strong>Core Angle:</strong> “The 2:00 PM Focus Fuel” — Morning routine & deep work reels</li>
                          <li><strong>Deliverables:</strong> 6 Dedicated TikToks + 4 Instagram Collabs + 30-Day Ad Whitelisting</li>
                          <li><strong>Budget Split:</strong> $11,500 Creator Escrow · $3,500 Paid Amp reserve</li>
                          <li><strong>Milestones:</strong> Script Approval (Day 3) · Draft Review (Day 7) · Live Launch (Day 10)</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Pillar 2: Matching */}
                  {activePillar === 'matching' && (
                    <div className="bee-sim bee-sim--matching">
                      <div className="bee-match-card">
                        <div className="bee-match-card__avatar">MK</div>
                        <div className="bee-match-card__details">
                          <strong>Maya Patel (@mayacodes)</strong>
                          <span>Software Eng & Creator · 315K Verified Reach</span>
                          <div className="bee-match-card__chips">
                            <span>Audience: 78% 22-34 Yrs</span>
                            <span>Engagement: 5.2%</span>
                            <span>US/UK/EU</span>
                          </div>
                        </div>
                        <div className="bee-match-card__score">
                          <span className="bee-match-card__score-val">98.2%</span>
                          <span className="bee-match-card__score-lbl">Synergy Score</span>
                        </div>
                      </div>
                      <div className="bee-match-rationale">
                        <span className="bee-sim__bee-icon">🐝</span>
                        <p><strong>BEE Match Rationale:</strong> Maya’s audience displays a 94.6% affinity for high-performance workstation and beverage products. Verified bot risk is negligible (0.8%). Expected ROAS: 4.4x.</p>
                      </div>
                    </div>
                  )}

                  {/* Pillar 3: CRM & Scheduling */}
                  {activePillar === 'crm' && (
                    <div className="bee-sim bee-sim--crm">
                      <div className="bee-crm-timeline">
                        <div className="bee-crm-item bee-crm-item--done">
                          <span className="bee-crm-dot">✓</span>
                          <div>
                            <strong>Inbound Deal Initiated</strong>
                            <small>Synced deliverables & target dates</small>
                          </div>
                        </div>
                        <div className="bee-crm-item bee-crm-item--done">
                          <span className="bee-crm-dot">✓</span>
                          <div>
                            <strong>Instant Calendly Sync</strong>
                            <small>Kickoff meeting booked for Thursday, 3:00 PM EST</small>
                          </div>
                        </div>
                        <div className="bee-crm-item bee-crm-item--active">
                          <span className="bee-crm-dot">⚡</span>
                          <div>
                            <strong>Autonomous Nudge Ready</strong>
                            <small>“Drafting polite follow-up on asset review for brand partner”</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pillar 4: Performance */}
                  {activePillar === 'performance' && (
                    <div className="bee-sim bee-sim--performance">
                      <div className="bee-sim-stats-grid">
                        <div className="bee-sim-stat">
                          <span className="bee-sim-stat__lbl">Verified Impressions</span>
                          <strong className="bee-sim-stat__val">842,500</strong>
                          <span className="bee-sim-stat__trend">+28% vs estimate</span>
                        </div>
                        <div className="bee-sim-stat">
                          <span className="bee-sim-stat__lbl">Blended ROAS</span>
                          <strong className="bee-sim-stat__val bee-sim-stat__val--accent">4.62x</strong>
                          <span className="bee-sim-stat__trend">$69.3K attributed</span>
                        </div>
                        <div className="bee-sim-stat">
                          <span className="bee-sim-stat__lbl">Actionable Recommendation</span>
                          <p className="bee-sim-stat__rec">“Video hooks under 4 seconds generated 72% of checkout conversions. Reallocate remaining $2K budget to @mayacodes.”</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pillar 5: Assistant */}
                  {activePillar === 'assistant' && (
                    <div className="bee-sim bee-sim--assistant">
                      <div className="bee-chat-row bee-chat-row--user">
                        <div className="bee-chat-bubble bee-chat-bubble--user">
                          “Can you check if this creator’s recent follower spike is authentic?”
                        </div>
                      </div>
                      <div className="bee-chat-row bee-chat-row--bee">
                        <div className="bee-chat-avatar">🐝</div>
                        <div className="bee-chat-bubble bee-chat-bubble--bee">
                          <strong>BEE Forensic Shield:</strong> I ran a historical audit on @creator_x. The 45K spike on Oct 14 coincides with a viral TikTok video (3.2M views). Comment sentiment is 91% authentic humans, and geographic distribution is clean. Low risk — safe to partner!
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Capability Step Navigation Footer */}
              <div className="bee-pillar-panel__nav">
                <button
                  type="button"
                  className="bee-panel-nav-btn bee-panel-nav-btn--prev"
                  disabled={currentPillarIdx === 0}
                  onClick={() => currentPillarIdx > 0 && handlePillarChange(PILLARS[currentPillarIdx - 1].id)}
                  aria-label="Previous capability"
                  data-no-network
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{currentPillarIdx > 0 ? PILLARS[currentPillarIdx - 1].title : 'First Capability'}</span>
                </button>

                <div className="bee-pillar-panel__progress" aria-label={`Capability ${currentPillarIdx + 1} of ${PILLARS.length}`}>
                  <span className="bee-pillar-panel__step-num">0{currentPillarIdx + 1} / 0{PILLARS.length}</span>
                  <div className="bee-pillar-panel__track">
                    <div
                      className="bee-pillar-panel__bar"
                      style={{ width: `${((currentPillarIdx + 1) / PILLARS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="bee-panel-nav-btn bee-panel-nav-btn--next"
                  disabled={currentPillarIdx === PILLARS.length - 1}
                  onClick={() => currentPillarIdx < PILLARS.length - 1 && handlePillarChange(PILLARS[currentPillarIdx + 1].id)}
                  aria-label="Next capability"
                  data-no-network
                >
                  <span>{currentPillarIdx < PILLARS.length - 1 ? PILLARS[currentPillarIdx + 1].title : 'All Explored'}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
