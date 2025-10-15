import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeploymentDialog from '../DeploymentDialog';

describe('DeploymentDialog Unit Tests', () => {
  const mockOnClose = vi.fn();
  const mockOnDeploy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Renders without crashing when open
  it('Test 1: should render without crashing when open', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    expect(document.body).toBeTruthy();
  });

  // Test 2: Does not render when open=false
  it('Test 2: should not render when open is false', () => {
    render(
      <DeploymentDialog
        open={false}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // Test 3: Displays "Deploy to Production" title
  it('Test 3: should display Deploy to Production title', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    expect(screen.getByText('Deploy to Production')).toBeInTheDocument();
  });

  // Test 4: Shows workflow name when provided
  it('Test 4: should show workflow name when provided', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
        workflowName="Claims Detection v2.0.0"
      />
    );
    expect(screen.getByText(/Claims Detection v2.0.0/i)).toBeInTheDocument();
  });

  // Test 5: Shows deployment checklist
  it('Test 5: should show deployment checklist', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    expect(screen.getByText(/evaluation passed/i)).toBeInTheDocument();
    expect(screen.getByText(/approval obtained/i)).toBeInTheDocument();
  });

  // Test 6: Deploy button is disabled by default
  it('Test 6: deploy button should be disabled by default', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    const deployButton = screen.getByRole('button', { name: /deploy/i });
    expect(deployButton).toBeDisabled();
  });

  // Test 7: Version input field exists
  it('Test 7: version input field should exist', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );
    const versionInput = screen.getByLabelText(/version/i);
    expect(versionInput).toBeInTheDocument();
  });

  // Test 8: Checking all checklist items enables deploy button
  it('Test 8: checking all checklist items should enable deploy button', async () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );

    // Find all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');

    // Check all checkboxes
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Enter version
    const versionInput = screen.getByLabelText(/version/i);
    fireEvent.change(versionInput, { target: { value: 'v2.0.0' } });

    await waitFor(() => {
      const deployButton = screen.getByRole('button', { name: /deploy/i });
      expect(deployButton).toBeEnabled();
    });
  });

  // Test 9: Clicking Cancel calls onClose
  it('Test 9: clicking Cancel should call onClose', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 10: Clicking Deploy calls onDeploy with correct data
  it('Test 10: clicking Deploy should call onDeploy with correct data', async () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
        workflowName="Claims Detection v2.0.0"
      />
    );

    // Check all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Enter version
    const versionInput = screen.getByLabelText(/version/i);
    fireEvent.change(versionInput, { target: { value: 'v2.0.0' } });

    await waitFor(() => {
      const deployButton = screen.getByRole('button', { name: /deploy/i });
      expect(deployButton).toBeEnabled();
    });

    const deployButton = screen.getByRole('button', { name: /deploy/i });
    fireEvent.click(deployButton);

    expect(mockOnDeploy).toHaveBeenCalledWith({
      version: 'v2.0.0',
      workflowName: 'Claims Detection v2.0.0',
    });
  });

  // Test 11: Close button (X) calls onClose
  it('Test 11: close button X should call onClose', () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // Test 12: Version input is required to enable deploy
  it('Test 12: version input should be required to enable deploy', async () => {
    render(
      <DeploymentDialog
        open={true}
        onClose={mockOnClose}
        onDeploy={mockOnDeploy}
      />
    );

    // Check all checkboxes but don't enter version
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    // Deploy button should still be disabled without version
    const deployButton = screen.getByRole('button', { name: /deploy/i });
    expect(deployButton).toBeDisabled();

    // Now enter version
    const versionInput = screen.getByLabelText(/version/i);
    fireEvent.change(versionInput, { target: { value: 'v2.0.0' } });

    // Deploy button should now be enabled
    await waitFor(() => {
      expect(deployButton).toBeEnabled();
    });
  });
});
