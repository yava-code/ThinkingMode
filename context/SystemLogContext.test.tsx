import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SystemLogProvider, useSystemLog } from './SystemLogContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('SystemLogContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SystemLogProvider>{children}</SystemLogProvider>
  );

  it('initializes with a default session', () => {
    const { result } = renderHook(() => useSystemLog(), { wrapper });
    expect(result.current.sessions.length).toBe(1);
    expect(result.current.activeSessionId).not.toBeNull();
  });

  it('persists sessions to localStorage', () => {
    const { result } = renderHook(() => useSystemLog(), { wrapper });
    act(() => {
      result.current.createNewSession();
    });

    const saved = JSON.parse(localStorage.getItem('thinkmode_sessions') || '[]');
    expect(saved.length).toBe(2);
  });

  it('adds messages to the active session', () => {
    const { result } = renderHook(() => useSystemLog(), { wrapper });
    act(() => {
      result.current.addMessageToActiveSession('user', 'Hello');
    });

    const activeSession = result.current.sessions.find(s => s.id === result.current.activeSessionId);
    expect(activeSession?.messages.length).toBe(1);
    expect(activeSession?.messages[0].content).toBe('Hello');
  });

  it('changes reasoning mode', () => {
    const { result } = renderHook(() => useSystemLog(), { wrapper });
    act(() => {
      result.current.setReasoningMode('ARCHITECT' as any);
    });
    expect(result.current.reasoningMode).toBe('ARCHITECT');
    expect(localStorage.getItem('thinkmode_reasoning_mode')).toBe('ARCHITECT');
  });
});
