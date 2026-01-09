import React, { useEffect, useState, useRef } from 'react';

interface CustomCursorProps {
  isPaused: boolean;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isPaused }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (isPaused) return;

    const updatePosition = (e: MouseEvent) => {
      // Use requestAnimationFrame for performance
      if (requestRef.current) return;
      requestRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        requestRef.current = undefined;
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      
      // Spawn a new ripple
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      
      // Cleanup this specific ripple after its animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 800);
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused]);

  if (isPaused) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Main Cursor Dot */}
      <div 
        className="absolute w-3 h-3 bg-white rounded-full mix-blend-difference"
        style={{
          transform: `translate(${position.x - 6}px, ${position.y - 6}px)`,
          transition: 'transform 0.05s linear' 
        }}
      />
      
      {/* Glowing Trail */}
      <div 
        className="absolute w-8 h-8 rounded-full bg-blue-500/30 blur-md transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isClicking ? 0.75 : 1})`,
        }}
      />

      {/* Persistent Click Ripples */}
      {ripples.map((ripple) => (
        <div 
          key={ripple.id}
          className="absolute w-12 h-12 rounded-full border-2 border-blue-400 bg-blue-400/20 opacity-0 animate-ping"
          style={{
            top: ripple.y - 24,
            left: ripple.x - 24,
            animationDuration: '0.6s',
            animationIterationCount: 1,
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </div>
  );
};

export default CustomCursor;