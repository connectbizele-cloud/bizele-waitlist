import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import './MagneticButton.css';

interface MagneticButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  strength?: number; // pull strength (default 0.28)
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.28,
  ariaLabel,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    // Don't apply magnetic pull on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${isPressed ? 0.96 : isHovered ? 1.03 : 1})`,
  };

  return (
    <button
      ref={btnRef}
      className={`btn magnetic-btn ${isHovered ? 'magnetic-btn--hover' : ''} ${isPressed ? 'magnetic-btn--active' : ''} ${className}`}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-label={ariaLabel}
    >
      <span className="magnetic-btn__glow" aria-hidden="true" />
      <span className="magnetic-btn__content">{children}</span>
    </button>
  );
}
