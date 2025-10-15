import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductionEnvironment from '../ProductionEnvironment';
import { SnackbarProvider } from 'notistack';

// Mock ResizeObserver for React Flow
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('ProductionEnvironment Component - Tests 1-5', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Test 1: Renders without crashing (basic mount)
  it('Test 1: should render without crashing', () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <ProductionEnvironment />
        </SnackbarProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  // Test 3: Renders with empty localStorage
  it('Test 3: should render with empty localStorage', () => {
    localStorage.clear();
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <ProductionEnvironment />
        </SnackbarProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  // Test 4: Renders with mock workflows in localStorage
  it('Test 4: should render with mock workflows in localStorage', () => {
    const mockWorkflows = [
      {
        id: 'test-1',
        name: 'Test Workflow',
        version: '1.0.0',
        status: 'active',
        lastRun: '1 hour ago',
        totalRuns: 100,
        successRate: 95,
        avgExecutionTime: '2s',
        nodes: [],
        edges: [],
      },
    ];
    localStorage.setItem('demo-deployed-workflows', JSON.stringify(mockWorkflows));

    render(
      <BrowserRouter>
        <SnackbarProvider>
          <ProductionEnvironment />
        </SnackbarProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  // Test 5: data-testid="production-environment" exists in DOM
  it('Test 5: should have data-testid="production-environment" in DOM', () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <ProductionEnvironment />
        </SnackbarProvider>
      </BrowserRouter>
    );
    const element = screen.getByTestId('production-environment');
    expect(element).toBeInTheDocument();
  });
});
