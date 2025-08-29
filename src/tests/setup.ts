import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

window.scrollTo = vi.fn();

vi.mock('@/modules/game/hooks/useKeyboard', () => ({
  useKeyboard: vi.fn(),
}));

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.resetModules();
});
