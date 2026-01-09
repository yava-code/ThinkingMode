import React, { useState } from 'react';
import { Settings, Sun, Moon, Battery, Zap, Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../utils/audioSystem';
import { useSystemLog } from '../context/SystemLogContext';

interface ControlPanelProps {
  isLightMode: boolean;
  toggleTheme: () => void;
  isPaused: boolean;
  togglePause: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isLightMode, toggleTheme, isPaused, togglePause }) => {
  const [isMuted, setIsMuted] = useState(false);
  const { addLog } = useSystemLog();

  const handleMuteToggle = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    audioManager.toggleMute(newState);
    if (!newState) audioManager.playClick();
    addLog(`Audio subsystem ${newState ? 'MUTED' : 'ENABLED'}`, 'info');
  };

  const handleClick = (action: () => void, logMsg: string) => {
    audioManager.playClick();
    action();
    addLog(logMsg, 'info');
  };

  return (
    <div className="fixed bottom-12 right-4 z-50 flex flex-col items-end gap-2 group">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl flex flex-col gap-3 transition-all duration-300 opacity-50 hover:opacity-100 translate-y-2 hover:translate-y-0">
        <div className="flex items-center justify-between gap-4 text-[10px] uppercase font-mono tracking-widest text-gray-500 border-b border-gray-800 pb-1 mb-1">
          <span>System Controls</span>
          <Settings size={10} />
        </div>
        
        {/* Sound Toggle */}
        <button 
          onClick={handleMuteToggle}
          className="flex items-center justify-between gap-3 text-xs font-mono text-gray-300 hover:text-white transition-colors w-full px-2 py-1 rounded hover:bg-white/5 hover:animate-aura"
        >
          <span className="flex items-center gap-2">
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
            Audio
          </span>
          <span className={`text-[10px] px-1 rounded ${isMuted ? 'bg-red-900/30 text-red-400' : 'bg-slate-800 text-gray-400'}`}>
            {isMuted ? 'OFF' : 'ON'}
          </span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => handleClick(toggleTheme, `Theme switched to ${!isLightMode ? 'LIGHT' : 'DARK'} mode`)}
          className="flex items-center justify-between gap-3 text-xs font-mono text-gray-300 hover:text-white transition-colors w-full px-2 py-1 rounded hover:bg-white/5 hover:animate-aura"
        >
          <span className="flex items-center gap-2">
            {isLightMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-blue-400" />}
            Theme
          </span>
          <span className="text-[10px] bg-slate-800 px-1 rounded text-gray-400">
            {isLightMode ? 'LIGHT' : 'DARK'}
          </span>
        </button>

        {/* Animation Toggle */}
        <button 
          onClick={() => handleClick(togglePause, `Low Power Mode ${!isPaused ? 'ACTIVATED' : 'DEACTIVATED'}`)}
          className="flex items-center justify-between gap-3 text-xs font-mono text-gray-300 hover:text-white transition-colors w-full px-2 py-1 rounded hover:bg-white/5 hover:animate-aura"
        >
          <span className="flex items-center gap-2">
            {isPaused ? <Battery size={14} className="text-green-400" /> : <Zap size={14} className="text-orange-400" />}
            Optimization
          </span>
          <span className={`text-[10px] px-1 rounded ${isPaused ? 'bg-green-900/30 text-green-400' : 'bg-slate-800 text-gray-400'}`}>
            {isPaused ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;