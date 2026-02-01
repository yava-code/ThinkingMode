import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DemoSection from './DemoSection';
import React from 'react';
import * as geminiService from '../services/geminiService';
import { SystemLogProvider } from '../context/SystemLogContext';

// Mock the gemini service
vi.mock('../services/geminiService', () => ({
  generateStreamingResponse: vi.fn(),
  generateFastResponse: vi.fn(),
  generateThinkingResponse: vi.fn(),
}));

// Mock audioManager
vi.mock('../utils/audioSystem', () => ({
  audioManager: {
    playClick: vi.fn(),
    startThinking: vi.fn(),
    stopThinking: vi.fn(),
  }
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <SystemLogProvider>{children}</SystemLogProvider>
);

describe('DemoSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default scenario', () => {
    render(<DemoSection isLightMode={false} />, { wrapper: Wrapper });
    expect(screen.getByText('The Split-Screen Test')).toBeInTheDocument();
    expect(screen.getByText('The Drying Time Trap')).toBeInTheDocument();
  });

  it('switches scenarios when clicked', () => {
    render(<DemoSection isLightMode={false} />, { wrapper: Wrapper });
    const scenarioBtn = screen.getByText('The "Strawberry" Test');
    fireEvent.click(scenarioBtn);

    const textarea = screen.getByPlaceholderText(/How many times does the letter "r" appear in the word "Strawberry"?/i);
    expect(textarea).toBeInTheDocument();
  });

  it('calls generate functions when Run Experiment is clicked', async () => {
    vi.mocked(geminiService.generateStreamingResponse).mockResolvedValue('answer');

    render(<DemoSection isLightMode={false} />, { wrapper: Wrapper });
    const runBtn = screen.getByText('Run Experiment');
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(geminiService.generateStreamingResponse).toHaveBeenCalled();
    });
  });
});
