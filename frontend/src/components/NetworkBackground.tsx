import { useEffect, useRef } from 'react';
import type { Role } from '@/lib/role';

interface NetworkBackgroundProps {
  role?: Role | null;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  phase: number;
  hasWord: boolean;
  currentWord: string;
  nextWord: string;
  wordAlpha: number; // 0 to 1 for cross-fade
  fadeStart: number; // timestamp
  fadeDuration: number;
  highlightIntensity: number; // 0 to 1 when lit by ripple
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  maxRadius: number;
  speed: number; // px/s
}

interface CalmZone {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const WORDS: Record<Role | 'neutral', string[]> = {
  neutral: [
    'Collaborate',
    'Growth',
    'Escrow',
    'Reach',
    'Authenticity',
    'Campaigns',
    'Synergy',
    'ROI',
    'Insights',
    'Connect',
    'Creators',
    'Brands',
    'Automation',
    'Milestones',
    'Community',
    'Elevation',
  ],
  business: [
    'Target ROAS',
    'Verified Audit',
    'Escrow Protected',
    'Attribution',
    'Conversions',
    'Milestones',
    'Enterprise',
    'Ambassadors',
    'Benchmarks',
    'Compliance',
    'Bot Free',
    'Multi-Touch',
    'Predictive Fit',
    'Scale Budget',
    '1099 Handled',
  ],
  creator: [
    'Zero Pitching',
    'Direct Payouts',
    'Live Media Kit',
    'Sponsorships',
    '100% Escrow',
    'Brand Deals',
    'Creative Freedom',
    'Audience Trust',
    'Verified Stats',
    'Fair Rates',
    'Instant Payout',
    'Inbound Offers',
    'No Net-90',
    'Stripe Deposit',
    'Vetted Brands',
  ],
};

const WORD_SHARE = 0.36;
const CALM_MARGIN = 28;
const CALM_ALPHA_FACTOR = 0.32;

export function NetworkBackground({ role = null }: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRoleRef = useRef<Role | null>(role);
  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId: number;
    let nodes: Node[] = [];
    const ripples: Ripple[] = [];
    let calmZones: CalmZone[] = [];
    let lastTime = performance.now();
    let isVisible = !document.hidden;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Helper: Pick random word from list
    const getRoleWords = (r: Role | null) => WORDS[r || 'neutral'];
    const getRandomWord = (r: Role | null, exclude?: string): string => {
      const list = getRoleWords(r);
      const candidates = list.filter((w) => w !== exclude);
      return candidates[Math.floor(Math.random() * candidates.length)] || list[0];
    };

    // Calculate node count based on area
    const calculateNodeCount = (w: number, h: number) => {
      if (w < 640) {
        return Math.min(34, Math.max(16, Math.floor((w * h) / 18000)));
      }
      return Math.min(84, Math.max(26, Math.floor((w * h) / 22000)));
    };

    // Initialize or reseed nodes
    const seedNodes = (newWidth: number, newHeight: number) => {
      const count = calculateNodeCount(newWidth, newHeight);
      const activeRole = currentRoleRef.current;
      const newNodes: Node[] = [];

      for (let i = 0; i < count; i++) {
        const hasWord = Math.random() < WORD_SHARE;
        const speed = prefersReducedMotion ? 0 : 0.25 + Math.random() * 0.35;
        const angle = Math.random() * Math.PI * 2;
        const word = hasWord ? getRandomWord(activeRole) : '';

        newNodes.push({
          x: Math.random() * newWidth,
          y: Math.random() * newHeight,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          phase: Math.random() * Math.PI * 2,
          hasWord,
          currentWord: word,
          nextWord: word,
          wordAlpha: 1,
          fadeStart: 0,
          fadeDuration: 900,
          highlightIntensity: 0,
        });
      }

      nodes = newNodes;
    };

    // Measure and cache calm zones with 400ms throttle
    const updateCalmZones = () => {
      const elements = document.querySelectorAll('[data-network-calm]');
      const zones: CalmZone[] = [];
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        zones.push({
          x1: rect.left - CALM_MARGIN,
          y1: rect.top - CALM_MARGIN,
          x2: rect.right + CALM_MARGIN,
          y2: rect.bottom + CALM_MARGIN,
        });
      });
      calmZones = zones;
    };

    let calmTimeout: ReturnType<typeof setTimeout> | null = null;
    const scheduleCalmUpdate = () => {
      if (calmTimeout) return;
      calmTimeout = setTimeout(() => {
        updateCalmZones();
        calmTimeout = null;
      }, 400);
    };

    // Handle canvas resizing (only reseed if width changes to prevent mobile jump)
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const widthChanged = Math.abs(newWidth - width) > 1;

      width = newWidth;
      height = newHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (widthChanged || nodes.length === 0) {
        seedNodes(width, height);
      }
      updateCalmZones();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', scheduleCalmUpdate, { passive: true });

    // Check if point is inside a calm zone
    const isPointInCalm = (px: number, py: number) => {
      for (let i = 0; i < calmZones.length; i++) {
        const z = calmZones[i];
        if (px >= z.x1 && px <= z.x2 && py >= z.y1 && py <= z.y2) {
          return true;
        }
      }
      return false;
    };

    // Trigger ripple animation at coordinate
    const triggerRipple = (rx: number, ry: number) => {
      if (nodes.length === 0) return;

      // Find nearest node
      let nearestNode: Node = nodes[0];
      let minDistSq = Infinity;
      for (const node of nodes) {
        const dSq = (node.x - rx) ** 2 + (node.y - ry) ** 2;
        if (dSq < minDistSq) {
          minDistSq = dSq;
          nearestNode = node;
        }
      }

      nearestNode.highlightIntensity = 1;

      ripples.push({
        x: rx,
        y: ry,
        startTime: performance.now(),
        maxRadius: prefersReducedMotion ? 120 : 380,
        speed: prefersReducedMotion ? 200 : 520,
      });
    };

    // Ignore clicks on interactive components
    const isInteractive = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      const selector =
        'a, button, input, textarea, select, label, summary, [role="radio"], [role="button"], [data-no-network]';
      return !!target.closest(selector);
    };

    const handlePointerDown = (e: MouseEvent | PointerEvent) => {
      if (isInteractive(e.target as HTMLElement)) return;
      triggerRipple(e.clientX, e.clientY);
    };

    const handleCustomPulse = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number }>;
      const x = customEvent.detail?.x ?? width / 2;
      const y = customEvent.detail?.y ?? height / 2;
      triggerRipple(x, y);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('bizele:pulse', handleCustomPulse as EventListener);

    // Cross-fade word wave when role changes
    const transitionRoleWords = (newRole: Role | null) => {
      const now = performance.now();
      const maxDist = width + height || 1;

      nodes.forEach((node) => {
        if (!node.hasWord) return;
        // Spatial wave from top-left corner
        const dist = (node.x + node.y) / maxDist;
        const delay = dist * 400; // spread wave over 400ms

        node.nextWord = getRandomWord(newRole, node.currentWord);
        node.fadeStart = now + delay;
        node.fadeDuration = 600; // fade completes over 600ms per node (900ms total wave)
      });
    };

    // Handle role prop updates
    if (!isFirstRenderRef.current || role !== null) {
      if (currentRoleRef.current !== role) {
        currentRoleRef.current = role;
        transitionRoleWords(role);
      }
    }
    isFirstRenderRef.current = false;

    // Visibility management
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main animation loop
    const render = (now: number) => {
      animationId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 640;
      const linkDist = isMobile ? 118 : 165;
      const linkDistSq = linkDist * linkDist;

      // Update and filter ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const elapsed = (now - ripple.startTime) / 1000;
        const currentRadius = elapsed * ripple.speed;

        if (currentRadius > ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Propagate ripple to nearby nodes
        const ringBand = 45;
        for (const node of nodes) {
          const d = Math.hypot(node.x - ripple.x, node.y - ripple.y);
          if (Math.abs(d - currentRadius) < ringBand) {
            const intensity = 1 - Math.abs(d - currentRadius) / ringBand;
            node.highlightIntensity = Math.max(node.highlightIntensity, intensity * 0.9);
          }
        }
      }

      // Update node positions and states
      for (const node of nodes) {
        if (!prefersReducedMotion) {
          node.phase += dt * 1.2;
          const wobbleX = Math.sin(node.phase) * 0.15;
          const wobbleY = Math.cos(node.phase) * 0.15;

          node.x += (node.baseVx + wobbleX);
          node.y += (node.baseVy + wobbleY);

          // Wrap edges smoothly
          if (node.x < -15) node.x = width + 15;
          if (node.x > width + 15) node.x = -15;
          if (node.y < -15) node.y = height + 15;
          if (node.y > height + 15) node.y = -15;
        }

        // Cool down highlight intensity
        if (node.highlightIntensity > 0) {
          node.highlightIntensity = Math.max(0, node.highlightIntensity - dt * 1.8);
        }

        // Cross-fade words
        if (node.hasWord && node.nextWord !== node.currentWord) {
          if (now >= node.fadeStart) {
            const progress = Math.min(1, (now - node.fadeStart) / node.fadeDuration);
            if (progress < 0.5) {
              node.wordAlpha = 1 - progress * 2;
            } else {
              node.currentWord = node.nextWord;
              node.wordAlpha = (progress - 0.5) * 2;
            }
          }
        }
      }

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < linkDistSq) {
            const dist = Math.sqrt(distSq);
            let alpha = (1 - dist / linkDist) * 0.22;

            // Ripple boost on connection
            const lineGlow = (a.highlightIntensity + b.highlightIntensity) * 0.5;
            if (lineGlow > 0.05) {
              alpha += lineGlow * 0.35;
            }

            // Calm zone check for midpoint
            const midX = (a.x + b.x) * 0.5;
            const midY = (a.y + b.y) * 0.5;
            if (isPointInCalm(midX, midY)) {
              alpha *= CALM_ALPHA_FACTOR;
            }

            if (alpha > 0.005) {
              ctx.strokeStyle = lineGlow > 0.2
                ? `rgba(216, 194, 240, ${Math.min(0.7, alpha)})`
                : `rgba(181, 145, 216, ${alpha})`;
              ctx.lineWidth = lineGlow > 0.2 ? 1.4 : 0.85;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw nodes and words
      const fontStack =
        '"Geist Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", ui-sans-serif, system-ui, sans-serif';
      ctx.font = '500 11px ' + fontStack;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const node of nodes) {
        let nodeAlpha = 0.55 + node.highlightIntensity * 0.45;
        let radius = 2.2 + node.highlightIntensity * 2.5;

        const inCalm = isPointInCalm(node.x, node.y);
        if (inCalm) {
          nodeAlpha *= CALM_ALPHA_FACTOR;
        }

        // Draw node dot
        ctx.fillStyle = node.highlightIntensity > 0.25
          ? `rgba(243, 217, 255, ${Math.min(1, nodeAlpha + 0.3)})`
          : `rgba(123, 50, 96, ${nodeAlpha})`;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw word tag if attached
        if (node.hasWord && node.currentWord) {
          let wordOpacity = Math.max(0, Math.min(1, node.wordAlpha)) * 0.72;
          if (node.highlightIntensity > 0.2) {
            wordOpacity = Math.min(1, wordOpacity + node.highlightIntensity * 0.4);
          }
          if (inCalm) {
            wordOpacity *= CALM_ALPHA_FACTOR;
          }

          if (wordOpacity > 0.03) {
            ctx.fillStyle = node.highlightIntensity > 0.3
              ? `rgba(243, 217, 255, ${wordOpacity})`
              : `rgba(141, 38, 55, ${wordOpacity})`;
            ctx.fillText(node.currentWord, node.x, node.y + 12);
          }
        }
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', scheduleCalmUpdate);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('bizele:pulse', handleCustomPulse as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (calmTimeout) clearTimeout(calmTimeout);
    };
  }, [role]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default NetworkBackground;
