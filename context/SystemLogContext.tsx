import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ChatSession, ReasoningMode, ChatMessage } from '../types';

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface SystemLogContextType {
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  reasoningMode: ReasoningMode;
  setReasoningMode: (mode: ReasoningMode) => void;
  createNewSession: () => void;
  deleteSession: (id: string) => void;
  setActiveSession: (id: string) => void;
  addMessageToActiveSession: (role: 'user' | 'assistant', content: string) => void;
  updateActiveSessionTitle: (title: string) => void;
}

const SystemLogContext = createContext<SystemLogContextType | undefined>(undefined);

const STORAGE_KEY_SESSIONS = 'thinkmode_sessions';
const STORAGE_KEY_LOGS = 'thinkmode_logs';
const STORAGE_KEY_MODE = 'thinkmode_reasoning_mode';

export const SystemLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return sessions.length > 0 ? sessions[0].id : null;
  });

  const [reasoningMode, setReasoningMode] = useState<ReasoningMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    return (saved as ReasoningMode) || ReasoningMode.DEBUG;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, reasoningMode);
  }, [reasoningMode]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
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
      const updated = [...prev, newLog];
      if (updated.length > 100) updated.shift();
      return updated;
    });
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Session',
      messages: [],
      lastUpdated: Date.now(),
      mode: reasoningMode
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    addLog(`Created new session: ${newSession.id}`, 'success');
  }, [reasoningMode, addLog]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
    addLog(`Deleted session: ${id}`, 'warning');
  }, [activeSessionId, addLog]);

  const setActiveSession = useCallback((id: string) => {
    setActiveSessionId(id);
    addLog(`Switched to session: ${id}`);
  }, [addLog]);

  const addMessageToActiveSession = useCallback((role: 'user' | 'assistant', content: string) => {
    if (!activeSessionId) return;

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          role,
          content,
          timestamp: Date.now()
        };
        return {
          ...session,
          messages: [...session.messages, newMessage],
          lastUpdated: Date.now()
        };
      }
      return session;
    }));
  }, [activeSessionId]);

  const updateActiveSessionTitle = useCallback((title: string) => {
    if (!activeSessionId) return;
    setSessions(prev => prev.map(session =>
      session.id === activeSessionId ? { ...session, title } : session
    ));
  }, [activeSessionId]);

  // Create an initial session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [sessions.length, createNewSession]);

  return (
    <SystemLogContext.Provider value={{
      logs, addLog, sessions, activeSessionId, reasoningMode, setReasoningMode,
      createNewSession, deleteSession, setActiveSession, addMessageToActiveSession,
      updateActiveSessionTitle
    }}>
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
