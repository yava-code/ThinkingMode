import React, { useEffect, useState, useRef } from 'react';
import { Brain, Zap, Loader2, Terminal, ChevronRight } from 'lucide-react';
import { ModelMode } from '../types';
import { audioManager } from '../utils/audioSystem';
import { useTypewriter } from '../hooks/useTypewriter';

interface ThinkingVisualizerProps {
  mode: ModelMode;
  isLoading: boolean;
  result: string | null;
  isLightMode: boolean;
}

const ThinkingVisualizer: React.FC<ThinkingVisualizerProps> = ({ mode, isLoading, result, isLightMode }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  
  // Custom hook for streaming result
  const displayedResult = useTypewriter(result, 8);

  // Audio Effect for Thinking State
  useEffect(() => {
    if (isLoading) {
      audioManager.startThinking();
      if (detailsRef.current) detailsRef.current.open = true;
    } else {
      audioManager.stopThinking();
    }
    return () => audioManager.stopThinking();
  }, [isLoading]);

  // Handle User Scroll to toggle Auto-Scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If user is within 50px of the bottom, enable auto-scroll. Otherwise, disable it.
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, displayedResult, shouldAutoScroll]); 

  // Reset auto-scroll when a new run starts
  useEffect(() => {
    if (isLoading) {
      setShouldAutoScroll(true);
    }
  }, [isLoading]);

  // Log Simulation (The "Thinking Process")
  useEffect(() => {
    if (!isLoading) {
      if (!result) {
        setLogs([]);
      }
      return;
    }

    setLogs([]);
    
    const fastLogs = [
      "// Ingesting prompt...",
      "// Tokenizing input...",
      "// Vector search...",
      "// Predicting next token...",
      "// Generating output...",
      "// Finalizing response..."
    ];
    
    const thinkLogs = [
      "// Analyzing intent...",
      "// Defining constraints...",
      "// Checking for logic traps...",
      "/* Strategy: Decomposition */",
      "// Step 1: Breakdown...",
      "// Step 2: Calculation...",
      "// Step 3: Verification...",
      "// Reviewing logical consistency...",
      "// Formatting final answer..."
    ];

    const currentLogs = mode === ModelMode.FAST ? fastLogs : thinkLogs;
    let index = 0;

    const interval = setInterval(() => {
      if (index < currentLogs.length) {
        setLogs(prev => [...prev, currentLogs[index]]);
        index++;
      }
    }, mode === ModelMode.FAST ? 300 : 800);

    return () => clearInterval(interval);
  }, [isLoading, mode, result]);

  const isFast = mode === ModelMode.FAST;

  // Styling based on mode/theme
  const containerClasses = isFast
    ? isLightMode 
      ? 'border-red-200 bg-white shadow-lg shadow-red-100' 
      : 'border-red-500/30 bg-red-950/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
    : isLightMode
      ? 'border-blue-200 bg-white shadow-lg shadow-blue-100'
      : 'border-blue-500/30 bg-blue-950/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]';

  const headerColor = isFast
    ? isLightMode ? 'text-red-600' : 'text-red-400'
    : isLightMode ? 'text-blue-600' : 'text-blue-400';

  const codeColor = isLightMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`relative h-full w-full rounded-xl border-2 p-1 overflow-hidden flex flex-col transition-all duration-500 ${containerClasses}`}>
      
      {/* Background Gradient */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className={`absolute inset-0 ${isFast ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent'}`}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isFast ? 'bg-red-500/10' : 'bg-blue-500/10'} ${headerColor}`}>
              {isFast ? <Zap size={20} /> : <Brain size={20} />}
            </div>
            <div>
              <h3 className={`font-bold text-base md:text-lg ${headerColor}`}>
                {isFast ? 'Impulse Engine' : 'Reasoning Engine'}
              </h3>
              <p className={`text-[10px] md:text-xs opacity-70`}>
                {isFast ? 'Zero-shot. No scratchpad.' : 'Chain of Thought enabled.'}
              </p>
            </div>
          </div>
          {isLoading && (
            <Loader2 className={`animate-spin ${headerColor}`} />
          )}
        </div>

        {/* Scrollable Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 pr-2 min-h-0 relative scroll-smooth w-full font-mono text-xs md:text-sm"
          style={{
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          {/* Collapsible Logs */}
          {(logs.length > 0) && (
             <details ref={detailsRef} className="mb-4 group" open>
               <summary 
                  onClick={() => audioManager.playClick()}
                  className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold mb-2 cursor-pointer hover:opacity-80 transition-opacity select-none list-none outline-none ${codeColor}`}
               >
                 <span className="transition-transform duration-200 group-open:rotate-90">
                    <ChevronRight size={14} />
                 </span>
                 Execution Trace
               </summary>
               
               <div className={`pl-3 border-l-2 ${isFast ? 'border-red-500/20' : 'border-blue-500/20'} space-y-1`}>
                    {logs.map((log, i) => (
                      <div key={i} className={`flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300 ${codeColor}`}>
                        <span className="opacity-50 select-none">{i + 1}</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="animate-pulse opacity-50 pl-6">...</div>
                    )}
                 </div>
             </details>
          )}

          {/* Final Result (Typewriter) */}
          {displayedResult && (
            <div className={`mt-4 pt-4 border-t ${isLightMode ? 'border-slate-200' : 'border-slate-700/50'}`}>
              <div className={`flex items-center gap-2 mb-2 ${isFast ? 'text-red-500' : 'text-blue-500'}`}>
                <Terminal size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Output Stream</span>
              </div>
              <div 
                className={`font-mono font-bold leading-relaxed ${isLightMode ? 'text-slate-900' : 'text-white'}`}
                style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
              >
                {displayedResult}
                {/* Blinking Cursor - using CSS block instead of char for consistent height */}
                <span className="animate-blink inline-block w-2.5 h-4 bg-current align-middle ml-1 -mt-1 shadow-[0_0_8px_currentColor]"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingVisualizer;