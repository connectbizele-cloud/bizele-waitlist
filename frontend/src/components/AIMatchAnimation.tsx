import { useEffect, useRef, useState } from 'react';
import './AIMatchAnimation.css';

interface AIMatchAnimationProps {
  /** 'creator' shows brand→creator flow; 'business' reverses it */
  perspective: 'creator' | 'business';
}

// ── Fictional demo data — clearly illustrative, not real users/results ──

const CREATOR_PROFILES = [
  { initials: 'ML', name: 'Maya Lin', niche: 'Lifestyle & Tech', color: '#C86A86' },
  { initials: 'JR', name: 'Jordan Ray', niche: 'Fitness & Wellness', color: '#A04D79' },
  { initials: 'SN', name: 'Sofia N.', niche: 'Beauty & Fashion', color: '#7B3260' },
];

const BRAND_PROFILES = [
  { initials: 'AA', name: 'Aura Acoustics', category: 'Consumer Tech', color: '#8D2637' },
  { initials: 'VB', name: 'Vera Beauty', category: 'Beauty & Skincare', color: '#A03045' },
  { initials: 'NF', name: 'NoveFit', category: 'Health & Fitness', color: '#7B3260' },
];

const BUSINESS_MESSAGES = [
  { from: 'user', text: 'Help me find creators for my next campaign.' },
  { from: 'ai',   text: "Let's find creators whose audience, content and style fit your brand." },
];

const CREATOR_MESSAGES = [
  { from: 'user', text: 'Find me brands that fit my audience.' },
  { from: 'ai',   text: "I'll match you with brands that align with your niche and creative style." },
];

export default function AIMatchAnimation({ perspective }: AIMatchAnimationProps) {
  const [step, setStep] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [connected, setConnected] = useState<number | null>(null);
  const isMounted = useRef(true);

  const messages = perspective === 'business' ? BUSINESS_MESSAGES : CREATOR_MESSAGES;

  // Phase timeline
  useEffect(() => {
    isMounted.current = true;

    // Reset on perspective change
    setStep(0);
    setTypingDone(false);
    setConnected(null);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Show final state immediately
      setStep(4);
      setTypingDone(true);
      setConnected(0);
      return;
    }

    // Step 0 → message appears
    const t1 = setTimeout(() => { if (isMounted.current) setStep(1); }, 600);
    // Step 1 → typing indicator then AI reply
    const t2 = setTimeout(() => { if (isMounted.current) { setStep(2); setTypingDone(false); } }, 1800);
    // Step 2 → typing done, show cards
    const t3 = setTimeout(() => { if (isMounted.current) { setTypingDone(true); setStep(3); } }, 3200);
    // Step 3 → connection animate
    const t4 = setTimeout(() => { if (isMounted.current) { setStep(4); setConnected(0); } }, 4800);
    // Loop back after 9 s
    const t5 = setTimeout(() => {
      if (isMounted.current) {
        setStep(0); setTypingDone(false); setConnected(null);
      }
    }, 9000);

    return () => {
      isMounted.current = false;
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5);
    };
  }, [perspective]);

  const profiles = perspective === 'business' ? CREATOR_PROFILES : BRAND_PROFILES;

  return (
    <div className="ai-anim" aria-label="Demonstration of Bizele AI matching flow" aria-live="polite">
      {/* Ambient particles */}
      <div className="ai-anim__particles" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`ai-anim__particle ai-anim__particle--${i % 4}`} />
        ))}
      </div>

      {/* Chat interface */}
      <div className="ai-anim__chat">
        <div className="ai-anim__chat-header">
          <span className="ai-anim__chat-dot" />
          <span className="ai-anim__chat-title">Bizele AI</span>
          <span className="ai-anim__chat-demo-badge">Demo</span>
        </div>

        <div className="ai-anim__messages">
          {/* User message */}
          {step >= 1 && (
            <div className={`ai-anim__msg ai-anim__msg--user ${step >= 1 ? 'ai-anim__msg--enter' : ''}`}>
              <div className="ai-anim__bubble ai-anim__bubble--user">
                {messages[0].text}
              </div>
            </div>
          )}

          {/* Typing indicator → then AI reply */}
          {step >= 2 && !typingDone && (
            <div className="ai-anim__msg ai-anim__msg--ai ai-anim__msg--enter">
              <div className="ai-anim__ai-avatar">B</div>
              <div className="ai-anim__bubble ai-anim__bubble--ai">
                <span className="ai-anim__typing">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}

          {step >= 2 && typingDone && (
            <div className="ai-anim__msg ai-anim__msg--ai ai-anim__msg--enter">
              <div className="ai-anim__ai-avatar">B</div>
              <div className="ai-anim__bubble ai-anim__bubble--ai">
                {messages[1].text}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile cards */}
      {step >= 3 && (
        <div className="ai-anim__cards" aria-label="Illustrative profile matches">
          {profiles.map((p, i) => (
            <div
              key={p.name}
              className={`ai-anim__card ${step >= 3 ? 'ai-anim__card--enter' : ''} ${connected === i ? 'ai-anim__card--connected' : ''}`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div
                className="ai-anim__card-avatar"
                style={{ background: p.color }}
              >
                {p.initials}
              </div>
              <div className="ai-anim__card-info">
                <strong className="ai-anim__card-name">{p.name}</strong>
                <span className="ai-anim__card-sub">
                  {'niche' in p ? p.niche : p.category}
                </span>
              </div>
              {connected === i && (
                <div className="ai-anim__card-match">
                  <span>✓ Match</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Connection line */}
      {step >= 4 && (
        <div className="ai-anim__connection" aria-hidden="true">
          <div className="ai-anim__connection-line">
            <div className="ai-anim__connection-dot" />
          </div>
          <p className="ai-anim__connection-label">Connected via Bizele</p>
        </div>
      )}

      {/* Demo disclaimer */}
      <p className="ai-anim__disclaimer">
        Illustrative demo · not real users or results
      </p>
    </div>
  );
}
