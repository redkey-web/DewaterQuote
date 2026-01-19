'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export default function MouseFollowGlow({
  color = 'white',
  intensity = 0.08,
  size = 'lg',
}: {
  color?: 'white' | 'primary' | 'cyan';
  intensity?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const colorMap = { white: 'rgba(255,255,255', primary: 'rgba(212,175,55', cyan: 'rgba(0,220,255' };
  const sizeMap = { sm: { width: 40, height: 35 }, md: { width: 60, height: 50 }, lg: { width: 80, height: 70 } };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const { width, height } = sizeMap[size];
  const baseColor = colorMap[color];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{
        background: 'radial-gradient(ellipse ${width}% ${height}% at ${mousePos.x}% ${mousePos.y}%, ${baseColor},${intensity}) 0%, ${baseColor},${intensity * 0.4}) 40%, transparent 70%)',
        transition: 'background 0.15s ease-out',
      }}
      aria-hidden="true"
    />
  );
}
