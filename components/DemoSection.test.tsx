import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DemoSection from './DemoSection';
import React from 'react';
import * as geminiService from '../services/geminiService';

// Mock the geminiService
vi.mock('../services/geminiService', () => ({
  generateFastResponse: vi.fn(),
  generateThinkingResponse: vi.fn(),
}));

// Mock the audioManager to prevent AudioContext errors in jsdom
vi.mock('../utils/audioSystem', () => ({
  audioManager: {
    playClick: vi.fn(),
    startThinking: vi.fn(),
    stopThinking: vi.fn(),
  },
}));

describe('DemoSection', () => {
  it('renders correctly and handles user interaction', async () => {
    (geminiService.generateFastResponse as vi.Mock).mockResolvedValue('Fast response');
    (geminiService.generateThinkingResponse as vi.Mock).mockResolvedValue('Thinking response');
    render(<DemoSection isLightMode={false} />);

    // Check that the component renders
    expect(screen.getByText('The Split-Screen Test')).toBeInTheDocument();

    // Check that the default scenario is active
    expect(screen.getByText('The Drying Time Trap').closest('button')).toHaveClass('bg-blue-600');

    // Click the "Run Experiment" button
    fireEvent.click(screen.getByText('Run Experiment'));

    // Check that the loading state is displayed
    await screen.findByText('Processing...');

    // Wait for the API calls to resolve and the results to be displayed
    await waitFor(() => {
      expect(screen.getByText('Fast response')).toBeInTheDocument();
      expect(screen.getByText('Thinking response')).toBeInTheDocument();
    });
  });
});
