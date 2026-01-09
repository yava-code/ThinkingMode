import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSystemLog } from '../context/SystemLogContext';

interface SystemTerminalProps {
  isLightMode: boolean;
}

const SystemTerminal: React.FC<SystemTerminalProps> = ({ isLightMode }) => {
  const { logs } = useSystemLog();
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive and terminal is expanded
  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  const latestLog = logs[logs.length - 1];
  
  // Theme Variables
  const bgColor = isLightMode ? 'bg-white/90' : 'bg-slate-950/90';
  const borderColor = isLightMode ? 'border-slate-200' : 'border-slate-800';
  const textColor = isLightMode ? 'text-slate-600' : 'text-slate-400';
  const accentColor = isLightMode ? 'text-blue-600' : 'text-emerald-500';
  const dotColor = isLightMode ? 'bg-blue-500' : 'bg-emerald-500';

  return (
    <div 
      className={`fixed bottom-0 left-0 w-full z-40 border-t backdrop-blur-md transition-all duration-300 ease-in-out font-mono text-xs shadow-[0_-5px_20px_rgba(0,0,0,0.1)] ${bgColor} ${borderColor} ${textColor}`}
      style={{ height: isExpanded ? '240px' : '32px' }}
    >
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-8 w-full flex items-center px-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
      >
        {/* Status Indicator */}
        <div className="flex items-center gap-3 mr-4 shrink-0">
          <div className="relative flex items-center justify-center w-2 h-2">
             <span className={`absolute w-full h-full rounded-full opacity-75 animate-ping ${dotColor}`}></span>
             <span className={`relative w-2 h-2 rounded-full ${dotColor}`}></span>
          </div>
          <span className={`font-bold tracking-widest transition-colors ${accentColor} group-hover:opacity-100 opacity-80`}>SYSTEM_LOG</span>
          <span className="opacity-20">::</span>
        </div>

        {/* Collapsed Preview (Latest Log) */}
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

        {/* Toggle Icon */}
        <div className="ml-auto pl-4 opacity-40 group-hover:opacity-100 transition-opacity">
           {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Expanded List */}
      <div className={`h-[208px] overflow-y-auto p-4 pr-32 space-y-1 ${isLightMode ? 'bg-slate-50/50' : 'bg-black/20'}`} ref={scrollRef}>
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
    </div>
  );
};

export default SystemTerminal;