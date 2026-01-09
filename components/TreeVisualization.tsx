import React, { useState } from 'react';

interface TreeVisualizationProps {
  isLightMode: boolean;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ isLightMode }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const strokeColor = isLightMode ? "#94a3b8" : "#475569";
  const activeStroke = "#3b82f6";
  const errorStroke = "#ef4444";
  const nodeFill = isLightMode ? "#e2e8f0" : "#1e293b";
  const nodeText = isLightMode ? "#475569" : "#cbd5e1";

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center select-none">
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Paths */}
        {/* Root -> Dead End */}
        <path 
          d="M200 30 L100 90" 
          stroke={hoveredNode === 'dead-end' ? errorStroke : strokeColor} 
          strokeWidth={hoveredNode === 'dead-end' ? 3 : 2}
          className="transition-all duration-300"
        />
        <path 
          d="M100 90 L60 160" 
          stroke={hoveredNode === 'dead-end' ? errorStroke : strokeColor} 
          strokeWidth={2}
          strokeDasharray="4"
          opacity="0.5"
        />

        {/* Root -> Solution Path */}
        <path 
          d="M200 30 L300 90" 
          stroke={activeStroke} 
          strokeWidth={3}
          className="animate-pulse"
        />
        <path 
          d="M300 90 L350 160" 
          stroke={activeStroke} 
          strokeWidth={3}
          className="animate-pulse"
        />
        <path 
          d="M300 90 L250 160" 
          stroke={strokeColor} 
          strokeWidth={2}
        />

        {/* Nodes */}
        {/* Root */}
        <g 
            onMouseEnter={() => setHoveredNode('root')}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer group"
        >
            <circle cx="200" cy="30" r="12" fill={nodeFill} stroke={activeStroke} strokeWidth="2" />
            <text x="200" y="34" fontSize="10" fill={nodeText} textAnchor="middle" fontWeight="bold">Q</text>
            
            {hoveredNode === 'root' && (
                <foreignObject x="140" y="-10" width="120" height="30">
                   <div className="bg-slate-800 text-white text-[10px] p-1 rounded text-center border border-slate-600 shadow-lg">
                       Input Question
                   </div>
                </foreignObject>
            )}
        </g>

        {/* Dead End Branch */}
        <g 
            onMouseEnter={() => setHoveredNode('dead-end')}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer group"
        >
            <circle cx="100" cy="90" r="10" fill={nodeFill} stroke={hoveredNode === 'dead-end' ? errorStroke : strokeColor} strokeWidth="2" />
             {hoveredNode === 'dead-end' && (
                <foreignObject x="40" y="50" width="120" height="30">
                   <div className="bg-red-900/90 text-white text-[10px] p-1 rounded text-center border border-red-700 shadow-lg">
                       Logic Trap Detected
                   </div>
                </foreignObject>
            )}
        </g>

        {/* Dead End Leaf */}
        <circle cx="60" cy="160" r="6" fill="#ef4444" opacity="0.6" />
        <text x="60" y="180" fontSize="10" fill="#ef4444" textAnchor="middle">Dead End</text>

        {/* Success Branch */}
        <g 
            onMouseEnter={() => setHoveredNode('success-mid')}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
        >
            <circle cx="300" cy="90" r="12" fill={activeStroke} filter="url(#glow)">
                <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
            </circle>
             {hoveredNode === 'success-mid' && (
                <foreignObject x="320" y="50" width="120" height="40">
                   <div className="bg-blue-900/90 text-white text-[10px] p-1 rounded text-center border border-blue-700 shadow-lg">
                       Evaluation Score: 0.95
                       <br/>Proceeding...
                   </div>
                </foreignObject>
            )}
        </g>

        {/* Alternative Leaf */}
        <circle cx="250" cy="160" r="8" fill={nodeFill} />
        
        {/* Solution Leaf */}
        <g 
            onMouseEnter={() => setHoveredNode('solution')}
            onMouseLeave={() => setHoveredNode(null)}
            className="cursor-pointer"
        >
            <circle cx="350" cy="160" r="12" fill="#10b981" filter="url(#glow)" />
            <text x="350" y="185" fontSize="10" fill="#10b981" textAnchor="middle" fontWeight="bold">Solution</text>
            
            {hoveredNode === 'solution' && (
                <foreignObject x="300" y="120" width="100" height="30">
                   <div className="bg-emerald-900/90 text-white text-[10px] p-1 rounded text-center border border-emerald-700 shadow-lg">
                       Verified Answer
                   </div>
                </foreignObject>
            )}
        </g>
      </svg>
      
      <div className={`absolute bottom-0 right-0 text-[10px] ${isLightMode ? 'text-slate-400' : 'text-slate-600'}`}>
          *Hover nodes to inspect state
      </div>
    </div>
  );
};

export default TreeVisualization;