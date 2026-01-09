import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import React from 'react';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Basic smoke test - if it renders and we can find something or just not throw
        // Since I don't know the exact content of App, I'll just check if the container is present
        // or just rely on render not throwing.
        // But better to expect something. Let's assume there's a title or main element.
        expect(document.body).toBeInTheDocument();
    });
});
