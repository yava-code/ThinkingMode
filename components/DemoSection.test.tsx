import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DemoSection from './DemoSection';
import React from 'react';
import * as geminiService from '../services/geminiService';

// Mock the gemini service
vi.mock('../services/geminiService', () => ({
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

describe('DemoSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default scenario', () => {
    render(<DemoSection isLightMode={false} />);
    expect(screen.getByText('The Split-Screen Test')).toBeInTheDocument();
    expect(screen.getByText('The Drying Time Trap')).toBeInTheDocument();
  });

  it('switches scenarios when clicked', () => {
    render(<DemoSection isLightMode={false} />);
    const scenarioBtn = screen.getByText('The "Strawberry" Test');
    fireEvent.click(scenarioBtn);

    // The textarea placeholder should change to the new scenario question
    const textarea = screen.getByPlaceholderText(/How many times does the letter "r" appear in the word "Strawberry"?/i);
    expect(textarea).toBeInTheDocument();
  });

  it('calls generate functions when Run Experiment is clicked', async () => {
    vi.mocked(geminiService.generateFastResponse).mockResolvedValue('Fast answer');
    vi.mocked(geminiService.generateThinkingResponse).mockResolvedValue('Thinking answer');

    render(<DemoSection isLightMode={false} />);
    const runBtn = screen.getByText('Run Experiment');
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(geminiService.generateFastResponse).toHaveBeenCalled();
      expect(geminiService.generateThinkingResponse).toHaveBeenCalled();
    });
  });
});
