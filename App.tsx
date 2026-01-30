import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import DemoSection from './components/DemoSection';
import MatrixBackground from './components/MatrixBackground';
import CustomCursor from './components/CustomCursor';
import ControlPanel from './components/ControlPanel';
import LearnSection from './components/LearnSection';
import SystemTerminal from './components/SystemTerminal';
import { audioManager } from './utils/audioSystem';
import { SystemLogProvider, useSystemLog } from './context/SystemLogContext';

// Separated Inner Component to use the Context
const AppContent: React.FC = () => {
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  
  const { addLog } = useSystemLog();

  // Boot Sequence Logging
  useEffect(() => {
    const bootSequence = [
        { msg: "Initializing kernel...", delay: 200 },
        { msg: "Mounting React virtual DOM...", delay: 600 },
        { msg: "Loading audio subsystem...", delay: 1000 },
        { msg: "Checking GPU acceleration...", delay: 1400 },
        { msg: "System interface ready.", delay: 1800, type: 'success' as const }
    ];

    bootSequence.forEach(({ msg, delay, type }) => {
        setTimeout(() => addLog(msg, type || 'info'), delay);
    });
  }, [addLog]);

  // Manage custom cursor body class
  useEffect(() => {
    if (isPaused) {
      document.body.classList.remove('custom-cursor-active');
    } else {
      document.body.classList.add('custom-cursor-active');
    }
  }, [isPaused]);

  // Check for API Key in environment
  useEffect(() => {
    const checkKey = async () => {
      // Check environment first
      if (process.env.API_KEY || process.env.GEMINI_API_KEY) {
        addLog("Environment API Key detected and loaded.", 'success');
      } else {
        addLog("No API Key found in environment. Please set VITE_GEMINI_API_KEY.", 'warning');
      }
    };
    
    // Slight delay to ensure it logs after boot sequence
    setTimeout(checkKey, 2000);
  }, [addLog]);

  const toggleTheme = () => setIsLightMode(!isLightMode);
  const togglePause = () => setIsPaused(!isPaused);

  // Main Application UI
  const bgClass = isLightMode ? 'bg-[#F8F9FA]' : 'bg-[#0f172a]';
  const textClass = isLightMode ? 'text-[#1A1A1B]' : 'text-slate-100';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} selection:bg-blue-500 selection:text-white relative transition-colors duration-500 select-none pb-12`}>
      <style>{`
        html { scroll-behavior: smooth; }
      `}</style>
      
      <CustomCursor isPaused={isPaused} />
      <MatrixBackground paused={isPaused} isLightMode={isLightMode} isLoading={isGlobalLoading} />
      
      <ControlPanel 
        isLightMode={isLightMode} 
        toggleTheme={toggleTheme} 
        isPaused={isPaused} 
        togglePause={togglePause} 
      />

      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-500 ${isLightMode ? 'bg-white/80 border-slate-200' : 'bg-[#0f172a]/80 border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className={`font-mono font-bold text-xl tracking-tighter ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
            THINK<span className="text-blue-500">MODE</span><span className="animate-blink">_</span>
          </div>
          <div className="text-xs font-mono text-gray-500 hidden sm:block">
            <a href="https://github.com/yava-code/ThinkingMode">Visit my GitHub</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <Hero isLightMode={isLightMode} />
        <DemoSection isLightMode={isLightMode} setGlobalLoading={setIsGlobalLoading} />
        <LearnSection isLightMode={isLightMode} />
      </main>

      <footer className={`relative z-10 py-8 text-center text-sm border-t transition-colors duration-500 mb-8 ${isLightMode ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-[#0f172a] text-slate-600 border-slate-900'}`}>
        <p>© {new Date().getFullYear()} ThinkMode Interactive. Powered by Google Gemini.</p>
      </footer>

      {/* Persistent Terminal Footer */}
      <SystemTerminal isLightMode={isLightMode} />
    </div>
  );
};

// Root App Wrapper for Providers
const App: React.FC = () => {
  return (
    <SystemLogProvider>
      <AppContent />
    </SystemLogProvider>
  );
};

export default App;