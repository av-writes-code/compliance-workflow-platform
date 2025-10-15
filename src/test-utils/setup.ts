import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// Reset localStorage after each test
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
