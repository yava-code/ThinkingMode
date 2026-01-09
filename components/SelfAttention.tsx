import React, { useState, useRef, useEffect } from 'react';

interface SelfAttentionProps {
  isLightMode: boolean;
}

const SENTENCE = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];

// Hardcoded attention weights for specific tokens
// Key: index of token, Value: Array of {targetIndex, weight}
const ATTENTION_MAP: Record<number, { target: number, weight: number }[]> = {
  7: [ // "it"
    { target: 1, weight: 0.95 }, // animal (strong)
    { target: 5, weight: 0.4 },  // street (weak)
    { target: 10, weight: 0.8 }, // tired (strong context)
  ],
  10: [ // "tired"
    { target: 1, weight: 0.7 }, // animal
    { target: 7, weight: 0.8 }, // it
  ],
  2: [ // "didn't"
    { target: 3, weight: 0.9 }, // cross
  ]
};

const SelfAttention: React.FC<SelfAttentionProps> = ({ isLightMode }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tokenPositions, setTokenPositions] = useState<{x: number, y: number}[]>([]);

  // Update positions on resize
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const tokens = containerRef.current.querySelectorAll('.token-span');
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const positions = Array.from(tokens).map((token) => {
        const rect = (token as Element).getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height, // Bottom of token
        };
      });
      setTokenPositions(positions);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const getCurves = () => {
    if (hoveredIndex === null || !tokenPositions.length) return null;
    
    // Default: Connect to itself
    const relationships = ATTENTION_MAP[hoveredIndex] || [];
    
    return relationships.map((rel, i) => {
      if (!tokenPositions[hoveredIndex] || !tokenPositions[rel.target]) return null;
      
      const start = tokenPositions[hoveredIndex];
      const end = tokenPositions[rel.target];
      
      // Control points for Bezier curve (arc upwards)
      const midX = (start.x + end.x) / 2;
      const midY = Math.min(start.y, end.y) - 60 * (1 + rel.weight); // Height depends on weight

      return (
        <path
          key={i}
          d={`M ${start.x} ${start.y - 10} Q ${midX} ${midY} ${end.x} ${end.y - 10}`}
          fill="none"
          stroke={isLightMode ? "#3b82f6" : "#60a5fa"}
          strokeWidth={Math.max(1, rel.weight * 4)}
          strokeOpacity={rel.weight}
          className="animate-in fade-in duration-300"
        />
      );
    });
  };

  return (
    <div className="relative w-full p-8 rounded-xl border border-slate-700/50 bg-slate-900/50 flex flex-col items-center justify-center min-h-[200px] select-none">
      
      {/* SVG Overlay for Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
        {getCurves()}
      </svg>

      {/* Label */}
      <div className="absolute top-2 left-4 text-[10px] font-mono uppercase tracking-widest opacity-50">
        Interactive Self-Attention Head
      </div>

      {/* Tokens */}
      <div ref={containerRef} className="flex flex-wrap justify-center gap-3 relative z-20">
        {SENTENCE.map((word, i) => (
          <span
            key={i}
            className={`token-span px-2 py-1 rounded cursor-pointer transition-all duration-300 ${
              hoveredIndex === i 
                ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/50' 
                : hoveredIndex !== null && ATTENTION_MAP[hoveredIndex]?.some(r => r.target === i)
                  ? 'bg-blue-500/30 text-blue-200' // Target of attention
                  : isLightMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {word}
          </span>
        ))}
      </div>
      
      <div className="mt-8 text-xs font-mono text-center opacity-50 h-4">
        {hoveredIndex !== null && ATTENTION_MAP[hoveredIndex] 
          ? `Attention( "${SENTENCE[hoveredIndex]}" ) => [ ${ATTENTION_MAP[hoveredIndex].map(r => `"${SENTENCE[r.target]}"`).join(', ')} ]`
          : "Hover over words to visualize dependencies"}
      </div>
    </div>
  );
};

export default SelfAttention;