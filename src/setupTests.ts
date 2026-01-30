import '@testing-library/jest-dom/vitest';
Object.defineProperty(window, 'aistudio', { value: { hasSelectedApiKey: () => Promise.resolve(true), openSelectKey: () => {} }, writable: true });
