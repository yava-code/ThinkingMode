import React, { useEffect, useState, useRef } from 'react';
import { Brain, Zap, Loader2, Terminal, ChevronRight, BarChart3 } from 'lucide-react';
import { ModelMode } from '../types';
import { audioManager } from '../utils/audioSystem';
import MarkdownRenderer from './MarkdownRenderer';
import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

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
  
  // Depth metrics for recharts
  const [depthData, setDepthData] = useState<{name: string, value: number}[]>([]);

  useEffect(() => {
    if (isLoading) {
      audioManager.startThinking();
      if (detailsRef.current) detailsRef.current.open = true;
      setDepthData([]);
    } else {
      audioManager.stopThinking();
    }
    return () => audioManager.stopThinking();
  }, [isLoading]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    if (shouldAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, result, shouldAutoScroll]);

  useEffect(() => {
    if (isLoading) setShouldAutoScroll(true);
  }, [isLoading]);

  // Log Simulation & Depth Tracking
  useEffect(() => {
    if (!isLoading) return;

    setLogs([]);
    const currentLogs = mode === ModelMode.FAST
      ? ["// Ingesting...", "// Tokenizing...", "// Predicting...", "// Outputting..."]
      : ["// Analyzing...", "// Defining...", "// Checking Traps...", "/* Strategy */", "// Step 1...", "// Step 2...", "// Verifying...", "// Finalizing..."];

    let index = 0;
    const interval = setInterval(() => {
      if (index < currentLogs.length) {
        setLogs(prev => [...prev, currentLogs[index]]);
        setDepthData(prev => [...prev, { name: `S${index}`, value: Math.random() * 100 }]);
        index++;
      }
    }, mode === ModelMode.FAST ? 200 : 500);

    return () => clearInterval(interval);
  }, [isLoading, mode]);

  const isFast = mode === ModelMode.FAST;
  const containerClasses = isFast
    ? isLightMode ? 'border-red-200 bg-white shadow-lg' : 'border-red-500/30 bg-red-950/10'
    : isLightMode ? 'border-emerald-200 bg-white shadow-lg' : 'border-emerald-500/30 bg-emerald-950/10';

  const headerColor = isFast
    ? isLightMode ? 'text-red-600' : 'text-red-400'
    : isLightMode ? 'text-emerald-600' : 'text-emerald-400';

  const codeColor = isLightMode ? 'text-slate-500' : 'text-slate-400';

  return (
    <div className={`relative h-full w-full rounded-xl border-2 p-1 overflow-hidden flex flex-col transition-all duration-500 ${containerClasses}`}>
      <div className="relative z-10 flex flex-col h-full p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isFast ? 'bg-red-500/10' : 'bg-emerald-500/10'} ${headerColor}`}>
              {isFast ? <Zap size={20} /> : <Brain size={20} />}
            </div>
            <div>
              <h3 className={`font-bold text-base uppercase tracking-tighter ${headerColor}`}>
                {isFast ? 'Impulse Engine' : 'Reasoning Engine'}
              </h3>
            </div>
          </div>
          {isLoading && <Loader2 className={`animate-spin ${headerColor}`} />}
        </div>

        {/* Depth Chart Area */}
        {isLoading && (
          <div className="h-12 mb-4 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depthData}>
                <Bar dataKey="value">
                  {depthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={isFast ? '#ef4444' : '#10b981'} opacity={0.3 + (index / depthData.length) * 0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Content Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 pr-2 min-h-0 relative overflow-y-auto scroll-smooth font-mono text-xs"
        >
          {/* Logs */}
          {logs.length > 0 && (
             <details ref={detailsRef} className="mb-4 group" open>
               <summary className={`flex items-center gap-2 text-[10px] uppercase font-bold mb-2 cursor-pointer list-none outline-none ${codeColor}`}>
                 <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                 TRACE_LOG
               </summary>
               <div className={`pl-3 border-l-2 ${isFast ? 'border-red-500/20' : 'border-emerald-500/20'} space-y-1 opacity-50`}>
                    {logs.map((log, i) => <div key={i}>{log}</div>)}
               </div>
             </details>
          )}

          {/* Result */}
          {result && (
            <div className={`mt-4 pt-4 border-t ${isLightMode ? 'border-slate-200' : 'border-slate-800/50'}`}>
              <div className={`flex items-center gap-2 mb-3 ${isFast ? 'text-red-500' : 'text-emerald-500'}`}>
                <Terminal size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Output</span>
              </div>
              <div className={`${isLightMode ? 'text-slate-900' : 'text-slate-100'}`}>
                <MarkdownRenderer content={result} isLightMode={isLightMode} />
                {isLoading && <span className="animate-blink inline-block w-2 h-4 bg-emerald-500 ml-1" />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingVisualizer;
