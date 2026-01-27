"use client";

import { useRef } from "react";

interface TensorVizProps {
  rows?: number;
  cols?: number;
}

export default function TensorViz({ rows = 12, cols = 12 }: TensorVizProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative inline-grid gap-px bg-gray-900 border border-gray-800 p-px group overflow-hidden cursor-crosshair select-none"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        // @ts-expect-error custom css property
        "--mouse-x": "-100px",
        "--mouse-y": "-100px",
      }}
    >
      {/* Glow effect overlay using radial gradient tracking mouse */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity opacity-0 group-hover:opacity-100"
        style={{
            background: `radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), rgba(102, 0, 0, 0.5), transparent 100%)`
        }}
      />
      
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="w-5 h-5 bg-black border border-gray-800/30 relative" />
      ))}
    </div>
  );
}
