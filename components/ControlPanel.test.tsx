import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';
import React from 'react';

// Mock the useSystemLog hook
vi.mock('../context/SystemLogContext', () => ({
  useSystemLog: () => ({
    addLog: vi.fn(),
  }),
}));

// Mock the audioManager
vi.mock('../utils/audioSystem', () => ({
  audioManager: {
    toggleMute: vi.fn(),
    playClick: vi.fn(),
  },
}));

describe('ControlPanel', () => {
  const mockToggleTheme = vi.fn();
  const mockTogglePause = vi.fn();

  it('renders correctly', () => {
    render(
      <ControlPanel
        isLightMode={false}
        toggleTheme={mockToggleTheme}
        isPaused={false}
        togglePause={mockTogglePause}
      />
    );

    expect(screen.getByText('System Controls')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Optimization')).toBeInTheDocument();
  });

  it('calls toggleTheme when the theme button is clicked', () => {
    render(
      <ControlPanel
        isLightMode={false}
        toggleTheme={mockToggleTheme}
        isPaused={false}
        togglePause={mockTogglePause}
      />
    );

    fireEvent.click(screen.getByText('Theme'));
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls togglePause when the optimization button is clicked', () => {
    render(
      <ControlPanel
        isLightMode={false}
        toggleTheme={mockToggleTheme}
        isPaused={false}
        togglePause={mockTogglePause}
      />
    );

    fireEvent.click(screen.getByText('Optimization'));
    expect(mockTogglePause).toHaveBeenCalledTimes(1);
  });
});
