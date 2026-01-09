import '@testing-library/jest-dom';
Object.defineProperty(window, 'aistudio', { value: { hasSelectedApiKey: () => Promise.resolve(true), openSelectKey: () => {} }, writable: true });
