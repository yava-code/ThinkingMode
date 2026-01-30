import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

// Mock audioManager
vi.mock('./utils/audioSystem', () => ({
  audioManager: {
    playClick: vi.fn(),
    startThinking: vi.fn(),
    stopThinking: vi.fn(),
    toggleMute: vi.fn(),
  }
}));

describe('App', () => {
    it('renders main application content', () => {
        render(<App />);
        // Use getAllByText for non-unique text or use more specific queries
        expect(screen.getAllByText(/THINK/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/MODE/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/The Split-Screen Test/i)).toBeInTheDocument();
    });
});
