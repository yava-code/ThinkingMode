import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from './ControlPanel';
import React from 'react';
import { SystemLogProvider } from '../context/SystemLogContext';

// Mock audioManager
vi.mock('../utils/audioSystem', () => ({
  audioManager: {
    playClick: vi.fn(),
    toggleMute: vi.fn(),
  }
}));

describe('ControlPanel', () => {
  it('calls toggleTheme when theme button is clicked', () => {
    const toggleTheme = vi.fn();
    render(
      <SystemLogProvider>
        <ControlPanel
          isLightMode={false}
          toggleTheme={toggleTheme}
          isPaused={false}
          togglePause={() => {}}
        />
      </SystemLogProvider>
    );

    // Theme button contains "Theme" text
    const themeBtn = screen.getByText('Theme').closest('button');
    if (themeBtn) fireEvent.click(themeBtn);
    expect(toggleTheme).toHaveBeenCalled();
  });

  it('calls togglePause when pause button is clicked', () => {
    const togglePause = vi.fn();
    render(
      <SystemLogProvider>
        <ControlPanel
          isLightMode={false}
          toggleTheme={() => {}}
          isPaused={false}
          togglePause={togglePause}
        />
      </SystemLogProvider>
    );

    const pauseBtn = screen.getByText('Optimization').closest('button');
    if (pauseBtn) fireEvent.click(pauseBtn);
    expect(togglePause).toHaveBeenCalled();
  });
});
