import { useId } from 'react'
import { cn } from '@/lib/utils'
import type { BeeState } from '@/types/bee'
import './Bee.css'

export type BeeProps = {
  className?: string
  state?: BeeState
  /**
   * 'css' flaps the wings with keyframes. 'var' leaves them to the parent,
   * which sets `--flap` (degrees) so wing speed can ease smoothly.
   */
  wings?: 'css' | 'var'
  mood?: 'normal' | 'happy'
  /** Eye offset in SVG units (roughly -3..3) so BEE can glance around. */
  look?: { x: number; y: number }
}

/**
 * BEE — Bizele's Business Elevation Engine — a small rounded robot drawn
 * as inline SVG: pearl shell, dark visor with luminous eyes, gold details
 * and translucent mechanical wings.
 */
export function Bee({ className, state = 'idle', wings = 'css', mood = 'normal', look = { x: 0, y: 0 } }: BeeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const shell = `bee-shell-${uid}`
  const visor = `bee-visor-${uid}`
  const wing = `bee-wing-${uid}`
  const tip = `bee-tip-${uid}`
  const band = `bee-band-${uid}`
  const gold = `bee-gold-${uid}`
  const glow = `bee-glow-${uid}`
  const aura = `bee-aura-${uid}`
  const bodyClip = `bee-clip-${uid}`

  const wingClass = wings === 'css' ? 'bee-wing' : 'bee-wing-var'

  return (
    <svg
      viewBox="0 0 160 160"
      className={cn('block overflow-visible', className)}
      data-bee-state={state}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={shell} cx="0.36" cy="0.28" r="0.85">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#f5ece6" />
          <stop offset="80%" stopColor="#d9c7cc" />
          <stop offset="100%" stopColor="#b9a2b0" />
        </radialGradient>
        <linearGradient id={visor} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2e1a35" />
          <stop offset="100%" stopColor="#100812" />
        </linearGradient>
        <linearGradient id={wing} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#d8c2f0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#d07a9b" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={tip} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b591d8" />
          <stop offset="100%" stopColor="#d07a9b" />
        </linearGradient>
        <linearGradient id={band} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#674185" />
          <stop offset="55%" stopColor="#802f52" />
          <stop offset="100%" stopColor="#9b2323" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6dfa4" />
          <stop offset="100%" stopColor="#c99a4b" />
        </linearGradient>
        <radialGradient id={aura} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b591d8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#b591d8" stopOpacity="0" />
        </radialGradient>
        <filter id={glow} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={bodyClip}>
          <ellipse cx="80" cy="112" rx="25" ry="21" />
        </clipPath>
      </defs>

      {/* Soft ambient glow so BEE feels lit from within */}
      <circle cx="80" cy="84" r="74" fill={`url(#${aura})`} />

      {/* Wings — behind the body, hinged at the shoulders */}
      <g className={cn(wingClass, `${wingClass}--left`)}>
        <path
          d="M58 70 C 40 36, 10 30, 8 50 C 6 66, 32 76, 58 74 Z"
          fill={`url(#${wing})`}
          stroke="#f4e9ff"
          strokeOpacity="0.75"
          strokeWidth="1.3"
        />
        <path d="M56 72 C 40 58, 26 50, 14 50" stroke="#f4e9ff" strokeOpacity="0.45" strokeWidth="0.9" fill="none" />
        <path
          d="M58 80 C 42 82, 24 92, 28 102 C 32 110, 50 96, 59 84 Z"
          fill={`url(#${wing})`}
          stroke="#f4e9ff"
          strokeOpacity="0.6"
          strokeWidth="1.1"
        />
      </g>
      <g className={cn(wingClass, `${wingClass}--right`)}>
        <path
          d="M102 70 C 120 36, 150 30, 152 50 C 154 66, 128 76, 102 74 Z"
          fill={`url(#${wing})`}
          stroke="#f4e9ff"
          strokeOpacity="0.75"
          strokeWidth="1.3"
        />
        <path d="M104 72 C 120 58, 134 50, 146 50" stroke="#f4e9ff" strokeOpacity="0.45" strokeWidth="0.9" fill="none" />
        <path
          d="M102 80 C 118 82, 136 92, 132 102 C 128 110, 110 96, 101 84 Z"
          fill={`url(#${wing})`}
          stroke="#f4e9ff"
          strokeOpacity="0.6"
          strokeWidth="1.1"
        />
      </g>

      {/* Abdomen with metallic brand bands */}
      <ellipse cx="80" cy="112" rx="25" ry="21" fill={`url(#${shell})`} />
      <g clipPath={`url(#${bodyClip})`}>
        <rect x="50" y="104" width="60" height="6" fill={`url(#${band})`} opacity="0.92" />
        <rect x="50" y="116" width="60" height="6" fill={`url(#${band})`} opacity="0.92" />
        <ellipse cx="72" cy="100" rx="12" ry="5" fill="#ffffff" opacity="0.5" />
      </g>

      {/* Nozzle — BEE waters the flower from here */}
      <rect x="76" y="130" width="8" height="8" rx="2.5" fill={`url(#${gold})`} />
      <circle className="bee-core" cx="80" cy="139" r="2.4" fill="#f3d9ff" filter={`url(#${glow})`} />

      {/* Neck ring */}
      <ellipse cx="80" cy="88" rx="15" ry="4.5" fill={`url(#${gold})`} />

      {/* Antennae */}
      <path d="M80 45 Q76 34 70 28" stroke="#d9bfc6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M92 45 Q96 34 102 29" stroke="#d9bfc6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <circle cx="69.5" cy="27" r="3.6" fill={`url(#${tip})`} />
      <circle cx="102.5" cy="28" r="3.6" fill={`url(#${tip})`} />

      {/* Head shell */}
      <rect x="42" y="26" width="76" height="62" rx="28" fill={`url(#${shell})`} />
      <rect x="42" y="26" width="76" height="62" rx="28" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1" />
      <ellipse cx="62" cy="36" rx="12" ry="5" fill="#ffffff" opacity="0.75" transform="rotate(-18 62 36)" />

      {/* Visor screen */}
      <rect x="50" y="38" width="60" height="38" rx="17" fill={`url(#${visor})`} />
      <path d="M58 43 Q 80 39 102 43" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Luminous eyes: outer group blinks, inner group glances */}
      <g className="bee-eyes">
        <g className="bee-pupils" style={{ transform: `translate(${look.x}px, ${look.y}px)` }} filter={`url(#${glow})`}>
          {mood === 'happy' ? (
            <>
              <path d="M64 59 Q 70 51 76 59" stroke="#f3d9ff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
              <path d="M84 59 Q 90 51 96 59" stroke="#f3d9ff" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <rect x="64.5" y="49" width="11" height="14" rx="5.5" fill="#f3d9ff" />
              <rect x="84.5" y="49" width="11" height="14" rx="5.5" fill="#f3d9ff" />
              <circle cx="72.5" cy="52.5" r="1.7" fill="#ffffff" />
              <circle cx="92.5" cy="52.5" r="1.7" fill="#ffffff" />
            </>
          )}
        </g>
      </g>

      {/* Cheeks and smile */}
      <ellipse cx="73.5" cy="69" rx="3.6" ry="2.1" fill="#d07a9b" opacity="0.5" />
      <ellipse cx="98.5" cy="69" rx="3.6" ry="2.1" fill="#d07a9b" opacity="0.5" />
      <path d="M81.5 69.5 Q86 74 90.5 69.5" stroke="#1f1219" strokeWidth="1.9" strokeLinecap="round" fill="none" />

      {/* Gold ear bolts */}
      <circle cx="42.5" cy="58" r="4" fill={`url(#${gold})`} />
      <circle cx="117.5" cy="58" r="4" fill={`url(#${gold})`} />
    </svg>
  )
}

export default Bee
