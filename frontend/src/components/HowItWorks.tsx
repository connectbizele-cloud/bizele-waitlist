import { useEffect, useState } from 'react';
import './HowItWorks.css';

interface Stage {
  id: string;
  num: string;
  title: string;
  badge: string;
  desc: string;
  metrics: string[];
}

const STAGES: Stage[] = [
  {
    id: 'discover',
    num: '01',
    title: 'DISCOVER',
    badge: 'AI Creator Discovery',
    desc: 'Deep semantic search scours content across TikTok, Instagram, and YouTube to identify authentic creators who already love your niche.',
    metrics: ['Fake follower detection', 'Audience demographic audit', 'Engagement velocity score'],
  },
  {
    id: 'match',
    num: '02',
    title: 'MATCH',
    badge: 'Precision Compatibility',
    desc: 'Bizele AI calculates brand-creator synergy scores based on past performance, voice tone, and conversion likelihood.',
    metrics: ['98.4% brand-voice match', 'High audience conversion overlap', 'Automated rate benchmarking'],
  },
  {
    id: 'collaborate',
    num: '03',
    title: 'COLLABORATE',
    badge: 'Automated Workflows',
    desc: 'Execute standard contracts, manage content briefs, request revisions, and release escrow payments with zero manual back-and-forth.',
    metrics: ['Instant standard contracts', 'In-platform asset approval', 'Escrow-backed payout protection'],
  },
  {
    id: 'grow',
    num: '04',
    title: 'GROW',
    badge: 'Scalable Growth & ROI',
    desc: 'Turn one-off sponsorships into long-term ambassador networks with verifiable ROAS, tracking pixels, and performance analytics.',
    metrics: ['First-party click & sales tracking', 'Multi-touch creator attribution', 'Long-term ambassador scaling'],
  },
];

export default function HowItWorks() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance preview when not hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const current = STAGES[activeStage];

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      const next = (idx + 1) % STAGES.length;
      setActiveStage(next);
      setIsPaused(true);
    } else if (e.key === 'ArrowLeft') {
      const prev = (idx - 1 + STAGES.length) % STAGES.length;
      setActiveStage(prev);
      setIsPaused(true);
    }
  };

  return (
    <section
      className="section how-it-works"
      id="how-it-works"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="how-it-works__header">
          <span className="section__label">The Intelligence Engine</span>
          <h2 className="section__title">How Bizele Powers Collaboration</h2>
          <p className="how-it-works__sub">
            From initial discovery to scaled partnerships — an integrated 4-stage pipeline.
          </p>
        </div>

        {/* 4 Stage Stepper Navigation */}
        <div className="how-it-works__stepper" role="tablist" aria-label="Collaboration stages">
          {STAGES.map((stage, idx) => (
            <button
              key={stage.id}
              role="tab"
              id={`stage-tab-${stage.id}`}
              aria-controls={`stage-panel-${stage.id}`}
              aria-selected={activeStage === idx}
              tabIndex={activeStage === idx ? 0 : -1}
              className={`how-it-works__step-btn ${activeStage === idx ? 'how-it-works__step-btn--active' : ''}`}
              onClick={() => {
                setActiveStage(idx);
                setIsPaused(true);
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              <div className="how-it-works__step-bar">
                <span
                  className="how-it-works__step-fill"
                  style={{
                    width: activeStage === idx ? '100%' : activeStage > idx ? '100%' : '0%',
                  }}
                />
              </div>
              <div className="how-it-works__step-meta">
                <span className="how-it-works__step-num">{stage.num}</span>
                <span className="how-it-works__step-title">{stage.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dynamic Stage Interactive Visualizer */}
        <div
          className="how-it-works__stage-display"
          role="tabpanel"
          id={`stage-panel-${current.id}`}
          aria-labelledby={`stage-tab-${current.id}`}
        >
          {/* Left: Content Details */}
          <div className="how-it-works__stage-content">
            <span className="how-it-works__stage-badge">{current.badge}</span>
            <h3 className="how-it-works__stage-headline">
              Stage {current.num}: {current.title}
            </h3>
            <p className="how-it-works__stage-desc">{current.desc}</p>

            <div className="how-it-works__stage-metrics">
              {current.metrics.map((m) => (
                <div key={m} className="how-it-works__metric-item">
                  <span className="how-it-works__metric-dot" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Central Evolving Visual */}
          <div className="how-it-works__stage-visual" aria-hidden="true">
            <div className="how-it-works__visual-box">
              {/* Stage 1: DISCOVER */}
              {activeStage === 0 && (
                <div className="visual-stage visual-stage--discover">
                  <div className="visual-radar" />
                  <div className="visual-center-node">
                    <span>AI SCAN</span>
                  </div>
                  <div className="visual-node visual-node--c1">@creator1</div>
                  <div className="visual-node visual-node--c2">@creator2</div>
                  <div className="visual-node visual-node--c3">@creator3</div>
                  <div className="visual-node visual-node--c4">@creator4</div>
                  <span className="visual-tagline">Scanning 50,000+ niche creators...</span>
                </div>
              )}

              {/* Stage 2: MATCH */}
              {activeStage === 1 && (
                <div className="visual-stage visual-stage--match">
                  <div className="visual-match-card visual-match-card--brand">
                    <span className="visual-icon">🏢</span>
                    <strong>Brand Brief</strong>
                    <small>Beauty & Skincare</small>
                  </div>

                  <div className="visual-match-connector">
                    <div className="visual-match-score">98.4% MATCH</div>
                    <div className="visual-match-line" />
                  </div>

                  <div className="visual-match-card visual-match-card--creator">
                    <span className="visual-icon">🎨</span>
                    <strong>Top Creator</strong>
                    <small>High conversion fit</small>
                  </div>
                </div>
              )}

              {/* Stage 3: COLLABORATE */}
              {activeStage === 2 && (
                <div className="visual-stage visual-stage--collaborate">
                  <div className="visual-task-list">
                    <div className="visual-task visual-task--done">
                      <span className="visual-check">✓</span>
                      <span>Smart Contract Executed</span>
                      <span className="visual-chip">Secured</span>
                    </div>
                    <div className="visual-task visual-task--done">
                      <span className="visual-check">✓</span>
                      <span>Video Deliverable Submitted</span>
                      <span className="visual-chip">Approved</span>
                    </div>
                    <div className="visual-task visual-task--active">
                      <span className="visual-pulse-dot" />
                      <span>Escrow Payout Released</span>
                      <span className="visual-chip visual-chip--active">Auto-Dispatched</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage 4: GROW */}
              {activeStage === 3 && (
                <div className="visual-stage visual-stage--grow">
                  <div className="visual-growth-stat">
                    <span className="visual-growth-num">+340%</span>
                    <span className="visual-growth-label">Average Campaign ROAS</span>
                  </div>

                  <div className="visual-growth-bars">
                    <div className="visual-growth-bar visual-growth-bar--1" />
                    <div className="visual-growth-bar visual-growth-bar--2" />
                    <div className="visual-growth-bar visual-growth-bar--3" />
                    <div className="visual-growth-bar visual-growth-bar--4" />
                  </div>

                  <span className="visual-tagline">Long-term ambassador network scaled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
