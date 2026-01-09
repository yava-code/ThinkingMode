import React, { createContext, useContext, useState, useCallback } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SystemLogContextType {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
}

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

export const SystemLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    // Format: HH:MM:SS.ms
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
    
    setLogs(prev => {
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: timeString,
        message,
        type
      };
      // Keep last 50 logs to maintain performance
      const updated = [...prev, newLog];
      if (updated.length > 50) updated.shift();
      return updated;
    });
  }, []);

  return (
    <SystemLogContext.Provider value={{ logs, addLog }}>
      {children}
    </SystemLogContext.Provider>
  );
};

export const useSystemLog = () => {
  const context = useContext(SystemLogContext);
  if (!context) {
    throw new Error('useSystemLog must be used within a SystemLogProvider');
  }
  return context;
};