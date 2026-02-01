import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Terminal, Command, Cpu } from 'lucide-react';
import { useSystemLog } from '../context/SystemLogContext';
import { ReasoningMode } from '../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SystemTerminalProps {
  isLightMode: boolean;
}

const SystemTerminal: React.FC<SystemTerminalProps> = ({ isLightMode }) => {
  const { logs, reasoningMode, setReasoningMode } = useSystemLog();
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate fake token data for visual depth indicator
  const [tokenData, setTokenData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ time: i, tokens: Math.floor(Math.random() * 50) + 10 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, tokens: Math.floor(Math.random() * 80) + 20 }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  const latestLog = logs[logs.length - 1];
  
  const bgColor = isLightMode ? 'bg-white/95' : 'bg-slate-950/95';
  const borderColor = isLightMode ? 'border-slate-200' : 'border-slate-800';
  const textColor = isLightMode ? 'text-slate-600' : 'text-slate-400';
  const accentColor = isLightMode ? 'text-blue-600' : 'text-emerald-500';
  const dotColor = isLightMode ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div 
      className={`fixed bottom-0 left-0 w-full z-40 border-t backdrop-blur-md transition-all duration-300 ease-in-out font-mono text-xs shadow-[0_-5px_20px_rgba(0,0,0,0.1)] ${bgColor} ${borderColor} ${textColor}`}
      style={{ height: isExpanded ? '300px' : '32px' }}
    >
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-8 w-full flex items-center px-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
      >
        <div className="flex items-center gap-3 mr-4 shrink-0">
          <div className="relative flex items-center justify-center w-2 h-2">
             <span className={`absolute w-full h-full rounded-full opacity-75 animate-ping ${dotColor}`}></span>
             <span className={`relative w-2 h-2 rounded-full ${dotColor}`}></span>
          </div>
          <span className={`font-bold tracking-widest transition-colors ${accentColor} group-hover:opacity-100 opacity-80 uppercase`}>SYSTEM_LOG</span>
          <span className="opacity-20">::</span>
        </div>

        {!isExpanded && (
          <div className="flex-1 flex items-center gap-3 overflow-hidden pr-12">
            {latestLog ? (
               <div className="flex items-center gap-3 w-full animate-in fade-in slide-in-from-bottom-1 duration-300">
                 <span className="opacity-40 shrink-0 select-none">[{latestLog.timestamp}]</span>
                 <span className={`truncate ${
                    latestLog.type === 'error' ? 'text-red-500' : 
                    latestLog.type === 'success' ? (isLightMode ? 'text-emerald-600' : 'text-emerald-400') : 
                    latestLog.type === 'warning' ? 'text-orange-500' : ''
                 }`}>
                    {latestLog.message}
                 </span>
               </div>
            ) : (
                <span className="opacity-40 italic">Initializing core systems...</span>
            )}
          </div>
        )}

        {/* Small inline chart in collapsed state */}
        {!isExpanded && (
          <div className="w-32 h-6 mx-4 hidden md:block">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenData}>
                <Area type="monotone" dataKey="tokens" stroke={isLightMode ? "#2563eb" : "#10b981"} fill={isLightMode ? "#2563eb33" : "#10b98133"} strokeWidth={1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="ml-auto pl-4 opacity-40 group-hover:opacity-100 transition-opacity">
           {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Expanded Layout */}
      <div className={`h-[268px] flex overflow-hidden ${isLightMode ? 'bg-slate-50/50' : 'bg-black/20'}`}>
          {/* Main Logs Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1 border-r border-slate-800/20" ref={scrollRef}>
              {logs.map((log) => (
                 <div key={log.id} className="flex gap-3 font-mono hover:bg-black/5 dark:hover:bg-white/5 px-2 py-0.5 rounded -mx-2">
                     <span className="opacity-30 shrink-0 select-none">[{log.timestamp}]</span>
                     <span className="opacity-30 select-none">{'>'}</span>
                     <span className={`${
                        log.type === 'error' ? 'text-red-500' :
                        log.type === 'success' ? (isLightMode ? 'text-emerald-600' : 'text-emerald-400') :
                        log.type === 'warning' ? 'text-orange-500' : ''
                     }`}>
                        {log.message}
                     </span>
                 </div>
              ))}
          </div>

          {/* Right Panel: Modes & Metrics */}
          <div className="w-64 shrink-0 flex flex-col p-4 bg-black/10">
              <div className="flex items-center gap-2 mb-4 text-emerald-500">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Core Configuration</span>
              </div>

              {/* Mode Selector */}
              <div className="space-y-2 mb-6">
                 {Object.values(ReasoningMode).map(mode => (
                   <button
                     key={mode}
                     onClick={(e) => { e.stopPropagation(); setReasoningMode(mode); }}
                     className={`w-full text-left p-2 rounded border transition-all ${
                       reasoningMode === mode
                       ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                       : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'
                     }`}
                   >
                     <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold tracking-wider">{mode}</span>
                       {reasoningMode === mode && <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />}
                     </div>
                   </button>
                 ))}
              </div>

              {/* Thought Token Graph */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2 text-[8px] uppercase tracking-tighter opacity-50">
                  <span>Thought Tokens / ms</span>
                  <span className="text-emerald-500">{tokenData[tokenData.length-1].tokens} TP/s</span>
                </div>
                <div className="flex-1 bg-black/20 rounded border border-slate-800/30 overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tokenData}>
                      <defs>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="stepAfter" dataKey="tokens" stroke="#10b981" fillOpacity={1} fill="url(#colorTokens)" strokeWidth={1} isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SystemTerminal;
