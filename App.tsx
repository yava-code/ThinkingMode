import React, { useEffect, useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, Key } from 'lucide-react';
import Hero from './components/Hero';
import DemoSection from './components/DemoSection';
import MatrixBackground from './components/MatrixBackground';
import CustomCursor from './components/CustomCursor';
import ControlPanel from './components/ControlPanel';
import LearnSection from './components/LearnSection';
import SystemTerminal from './components/SystemTerminal';
import { audioManager } from './utils/audioSystem';
import { setDynamicApiKey } from './services/geminiService';
import { SystemLogProvider, useSystemLog } from './context/SystemLogContext';

// Separated Inner Component to use the Context
const AppContent: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [manualKey, setManualKey] = useState('');
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

  // Check for API Key
  useEffect(() => {
    const checkKey = async () => {
      // Check environment first
      if (process.env.API_KEY) {
        setApiKeyReady(true);
        addLog("Environment API Key detected.", 'success');
        return;
      } 
      
      // Check localStorage
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
          setDynamicApiKey(savedKey);
          setApiKeyReady(true);
          addLog("Stored credentials retrieved.", 'success');
          return;
      }

      // Check Project IDX
      if (window.aistudio) {
        try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
                setApiKeyReady(true);
                addLog("Project IDX credentials verified.", 'success');
            } else {
                addLog("Awaiting user credentials...", 'warning');
            }
        } catch {
            addLog("Error checking IDX environment.", 'error');
        }
      } else {
          addLog("Awaiting manual API key input...", 'warning');
      }
    };
    
    // Slight delay to ensure it logs after boot sequence
    setTimeout(checkKey, 2000);
  }, [addLog]);

  const handleSelectKey = async () => {
      audioManager.playClick();
      addLog("Initiating Google Account connection...", 'info');
      try {
          if (window.aistudio) {
            setError(null);
            await window.aistudio.openSelectKey();
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
              setApiKeyReady(true);
              addLog("Google Account connected successfully.", 'success');
            } else {
              addLog("Connection cancelled by user.", 'warning');
            }
          } else {
              setError("Project IDX environment not detected. Please use the Manual Entry below.");
              addLog("Environment Error: Project IDX not found.", 'error');
          }
      } catch (e) {
          console.error(e);
          setError("Connection failed. Please use the Manual Entry below.");
          addLog("Connection handshake failed.", 'error');
      }
  };

  const handleManualKeySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      audioManager.playClick();
      if (manualKey.trim().length > 10) {
          setDynamicApiKey(manualKey.trim());
          localStorage.setItem('gemini_api_key', manualKey.trim());
          setApiKeyReady(true);
          setError(null);
          addLog("Manual API key saved and verified.", 'success');
      } else {
          setError("Invalid API Key format.");
          addLog("Invalid API Key format submitted.", 'error');
      }
  };

  const toggleTheme = () => setIsLightMode(!isLightMode);
  const togglePause = () => setIsPaused(!isPaused);

  // Lock Screen (No API Key)
  if (!apiKeyReady && !process.env.API_KEY) {
      return (
          <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
              <MatrixBackground paused={false} isLightMode={false} isLoading={false} />
              <SystemTerminal isLightMode={false} />
              
              <div className="max-w-xl w-full bg-slate-900/95 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative z-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <Lock size={32} />
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Unlock Thinking Mode</h2>
                  <p className="text-slate-400 mb-8 text-base md:text-lg leading-relaxed">
                      Experience the difference between impulsive AI and Chain-of-Thought reasoning.
                  </p>

                  {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm text-left animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Configuration Issue</p>
                        <p className="opacity-90">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                      <button 
                        onClick={handleSelectKey}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group"
                      >
                          Connect Google Account
                          <CheckCircle2 size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-slate-700"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-slate-900 text-slate-500 uppercase tracking-wider text-xs">Or Enter Manually</span>
                          </div>
                      </div>

                      <form onSubmit={handleManualKeySubmit} className="flex gap-2">
                          <div className="relative flex-1 group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Key size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                              </div>
                              <input 
                                  type="password" 
                                  value={manualKey}
                                  onChange={(e) => setManualKey(e.target.value)}
                                  placeholder="Enter Gemini API Key (starts with AIza...)"
                                  className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 sm:text-sm transition-all"
                              />
                          </div>
                          <button 
                              type="submit"
                              disabled={!manualKey}
                              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Save
                          </button>
                      </form>
                  </div>
                  
                  <div className="mt-8 text-xs text-slate-500">
                      Your API key is stored locally in your browser. <br/>
                      <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-400 underline transition-colors">
                          Get a Gemini API Key
                      </a>
                  </div>
              </div>
          </div>
      );
  }

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