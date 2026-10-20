import { useEffect, useRef } from 'react';

interface Node {
  id: string;
  label: string;
  baseXRatio: number;
  baseYRatio: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isCenter?: boolean;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Observe visibility to avoid rendering when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial node layout (Creator, Brand, Bizele Hub, AI, Data)
    const nodes: Node[] = [
      {
        id: 'creator',
        label: 'CREATOR',
        baseXRatio: 0.22,
        baseYRatio: 0.32,
        x: width * 0.22,
        y: height * 0.32,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 12,
        color: '#C86A86',
      },
      {
        id: 'brand',
        label: 'BRAND',
        baseXRatio: 0.78,
        baseYRatio: 0.32,
        x: width * 0.78,
        y: height * 0.32,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 12,
        color: '#8D2637',
      },
      {
        id: 'bizele',
        label: 'BIZELE',
        baseXRatio: 0.5,
        baseYRatio: 0.52,
        x: width * 0.5,
        y: height * 0.52,
        vx: 0,
        vy: 0,
        radius: 20,
        color: '#7B3260',
        isCenter: true,
      },
      {
        id: 'ai',
        label: 'AI MATCHING',
        baseXRatio: 0.32,
        baseYRatio: 0.74,
        x: width * 0.32,
        y: height * 0.74,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 9,
        color: '#A04D79',
      },
      {
        id: 'data',
        label: 'PERFORMANCE DATA',
        baseXRatio: 0.68,
        baseYRatio: 0.74,
        x: width * 0.68,
        y: height * 0.74,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 9,
        color: '#8D2637',
      },
    ];

    // Ambient floating particles
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.35 + 0.1,
    }));

    const edges: [string, string][] = [
      ['creator', 'brand'],
      ['creator', 'bizele'],
      ['brand', 'bizele'],
      ['bizele', 'ai'],
      ['bizele', 'data'],
      ['ai', 'data'],
    ];

    const container = canvas.parentElement || canvas;

    const handlePointerMove = (e: MouseEvent | PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener('pointermove', handlePointerMove as EventListener);
    container.addEventListener('pointerleave', handlePointerLeave as EventListener);

    let time = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(render);
        return;
      }

      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Spring mouse interpolation
      if (mouseRef.current.active) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      } else {
        mouseRef.current.x += (width * 0.5 - mouseRef.current.x) * 0.02;
        mouseRef.current.y += (height * 0.5 - mouseRef.current.y) * 0.02;
      }

      // Draw subtle ambient glow behind center
      const gradient = ctx.createRadialGradient(
        mouseRef.current.x,
        mouseRef.current.y,
        10,
        mouseRef.current.x,
        mouseRef.current.y,
        width * 0.45
      );
      gradient.addColorStop(0, 'rgba(123, 50, 96, 0.07)');
      gradient.addColorStop(0.5, 'rgba(141, 38, 55, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw small ambient particles
      ctx.fillStyle = '#C86A86';
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Update nodes with gentle floating & subtle mouse attraction
      nodes.forEach((node, idx) => {
        const baseX = node.baseXRatio * width;
        const baseY = node.baseYRatio * height;

        if (!prefersReducedMotion) {
          const floatOffset = Math.sin(time + idx * 1.5) * 8;
          const floatOffsetX = Math.cos(time * 0.8 + idx) * 6;

          // Gentle pull toward cursor
          const dx = mouseRef.current.x - (baseX + floatOffsetX);
          const dy = mouseRef.current.y - (baseY + floatOffset);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / 350) * 22;

          node.x = baseX + floatOffsetX + (dist > 0 ? (dx / dist) * influence : 0);
          node.y = baseY + floatOffset + (dist > 0 ? (dy / dist) * influence : 0);
        } else {
          node.x = baseX;
          node.y = baseY;
        }
      });

      // Draw connection lines
      edges.forEach(([fromId, toId]) => {
        const from = nodes.find((n) => n.id === fromId);
        const to = nodes.find((n) => n.id === toId);
        if (!from || !to) return;

        const lineGradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        lineGradient.addColorStop(0, 'rgba(123, 50, 96, 0.22)');
        lineGradient.addColorStop(0.5, 'rgba(200, 106, 134, 0.35)');
        lineGradient.addColorStop(1, 'rgba(141, 38, 55, 0.22)');

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);

        // Curvature passing through midpoint
        const midX = (from.x + to.x) / 2 + Math.sin(time + from.x * 0.01) * 6;
        const midY = (from.y + to.y) / 2 + Math.cos(time + from.y * 0.01) * 6;
        ctx.quadraticCurveTo(midX, midY, to.x, to.y);

        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = from.isCenter || to.isCenter ? 2 : 1.2;
        ctx.stroke();

        // Traveling energy particle on edge
        if (!prefersReducedMotion) {
          const tProgress = (time * 0.5 + (from.x % 10)) % 1;
          const px = (1 - tProgress) * (1 - tProgress) * from.x + 2 * (1 - tProgress) * tProgress * midX + tProgress * tProgress * to.x;
          const py = (1 - tProgress) * (1 - tProgress) * from.y + 2 * (1 - tProgress) * tProgress * midY + tProgress * tProgress * to.y;

          ctx.fillStyle = '#C86A86';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw nodes
      nodes.forEach((node) => {
        // Outer halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = node.isCenter ? 'rgba(123, 50, 96, 0.12)' : 'rgba(200, 106, 134, 0.1)';
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Center dot highlight
        ctx.beginPath();
        ctx.arc(node.x - node.radius * 0.3, node.y - node.radius * 0.3, node.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        // Typography labels
        ctx.font = node.isCenter ? '700 12px Manrope, sans-serif' : '600 10px Inter, sans-serif';
        ctx.fillStyle = '#171217';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 16);
      });

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('pointermove', handlePointerMove as EventListener);
      container.removeEventListener('pointerleave', handlePointerLeave as EventListener);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-canvas" />
    </div>
  );
}
