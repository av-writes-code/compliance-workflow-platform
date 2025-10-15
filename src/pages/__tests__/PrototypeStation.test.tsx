import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import PrototypeStation from '../PrototypeStation';
import * as demoDataStore from '../../utils/demoDataStore';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('PrototypeStation Deploy Flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Test 6: PrototypeStation renders without crashing
  it('Test 6: should render without crashing', () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <PrototypeStation />
        </SnackbarProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  // Test 7: Deploy button exists when there are nodes
  it('Test 7: should show Deploy to Production button', async () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <PrototypeStation />
        </SnackbarProvider>
      </BrowserRouter>
    );

    // Load a template to get nodes
    const loadTemplateButton = screen.getByText('Load Template');
    fireEvent.click(loadTemplateButton);

    // Wait for menu
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeVisible();
    });

    const claimsOptions = screen.getAllByText('Claims Detection');
    fireEvent.click(claimsOptions[0]);

    // Check deploy button appears
    await waitFor(() => {
      expect(screen.getByText('Deploy to Production')).toBeVisible();
    });
  });

  // Test 8: addDeployedWorkflow is called on deploy
  it('Test 8: should call addDeployedWorkflow when deploying', { timeout: 15000 }, async () => {
    const addSpy = vi.spyOn(demoDataStore, 'addDeployedWorkflow');

    render(
      <BrowserRouter>
        <SnackbarProvider>
          <PrototypeStation />
        </SnackbarProvider>
      </BrowserRouter>
    );

    // Load template
    const loadTemplateButton = screen.getByText('Load Template');
    fireEvent.click(loadTemplateButton);
    await waitFor(() => screen.getByRole('menu'));
    const claimsOptions = screen.getAllByText('Claims Detection');
    fireEvent.click(claimsOptions[0]);

    // Open deploy dialog
    await waitFor(() => screen.getByText('Deploy to Production'));
    fireEvent.click(screen.getByText('Deploy to Production'));

    // Wait for dialog
    await waitFor(() => screen.getByRole('dialog'));

    // Fill in version
    const versionInput = screen.getByLabelText(/version/i);
    fireEvent.change(versionInput, { target: { value: 'v2.0.0' } });

    // Check all checklist items
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Click Deploy button (not "Deploy to Production" text)
    await waitFor(() => {
      const deployButton = screen.getByRole('button', { name: /^deploy$/i });
      expect(deployButton).toBeEnabled();
    });

    const deployButton = screen.getByRole('button', { name: /^deploy$/i });
    fireEvent.click(deployButton);

    // Check addDeployedWorkflow was called
    await waitFor(() => {
      expect(addSpy).toHaveBeenCalledOnce();
    }, { timeout: 3000 });
  });

  // Test 9: navigate is called with '/production' after deploy
  it('Test 9: should navigate to /production after deploy', { timeout: 15000 }, async () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <PrototypeStation />
        </SnackbarProvider>
      </BrowserRouter>
    );

    // Load template
    const loadTemplateButton = screen.getByText('Load Template');
    fireEvent.click(loadTemplateButton);
    await waitFor(() => screen.getByRole('menu'));
    const claimsOptions = screen.getAllByText('Claims Detection');
    fireEvent.click(claimsOptions[0]);

    // Deploy
    await waitFor(() => screen.getByText('Deploy to Production'));
    fireEvent.click(screen.getByText('Deploy to Production'));
    await waitFor(() => screen.getByRole('dialog'));

    // Fill in version
    const versionInput = screen.getByLabelText(/version/i);
    fireEvent.change(versionInput, { target: { value: 'v2.0.0' } });

    // Check all checklist items
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Click Deploy button
    await waitFor(() => {
      const deployButton = screen.getByRole('button', { name: /^deploy$/i });
      expect(deployButton).toBeEnabled();
    });

    const deployButton = screen.getByRole('button', { name: /^deploy$/i });
    fireEvent.click(deployButton);

    // Check navigate was called (wait for async handleDeploy with 100ms delay)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/production');
    }, { timeout: 3000 });
  });
});
