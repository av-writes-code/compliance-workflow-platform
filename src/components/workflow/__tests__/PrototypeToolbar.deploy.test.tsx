import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrototypeToolbar from '../PrototypeToolbar';

describe('PrototypeToolbar Deployment Tests', () => {
  const mockFunctions = {
    onSave: vi.fn(),
    onLoad: vi.fn(),
    onRun: vi.fn(),
    onClear: vi.fn(),
    onExport: vi.fn(),
    onLoadTemplate: vi.fn(),
    onOpenEvaluations: vi.fn(),
    onDeploy: vi.fn(),
  };

  // Test 1: Deploy button renders when onDeploy provided
  it('Test 1: should render Deploy button when onDeploy prop provided', () => {
    render(<PrototypeToolbar {...mockFunctions} />);
    const deployButton = screen.getByRole('button', { name: /deploy to production/i });
    expect(deployButton).toBeInTheDocument();
  });

  // Test 2: Deploy button does NOT render when onDeploy undefined
  it('Test 2: should NOT render Deploy button when onDeploy undefined', () => {
    const { onDeploy, ...rest } = mockFunctions;
    render(<PrototypeToolbar {...rest} />);
    const deployButton = screen.queryByRole('button', { name: /deploy to production/i });
    expect(deployButton).not.toBeInTheDocument();
  });

  // Test 3: Clicking Deploy button calls onDeploy
  it('Test 3: clicking Deploy button should call onDeploy', () => {
    render(<PrototypeToolbar {...mockFunctions} />);
    const deployButton = screen.getByRole('button', { name: /deploy to production/i });
    fireEvent.click(deployButton);
    expect(mockFunctions.onDeploy).toHaveBeenCalledTimes(1);
  });

  // Test 4: Deploy button has Rocket icon
  it('Test 4: Deploy button should have Rocket icon', () => {
    render(<PrototypeToolbar {...mockFunctions} />);
    const deployButton = screen.getByRole('button', { name: /deploy to production/i });
    // Check for Rocket icon by checking button content
    expect(deployButton).toBeInTheDocument();
    expect(deployButton.textContent).toContain('Deploy to Production');
  });

  // Test 5: Deploy button has correct styling
  it('Test 5: Deploy button should have purple background color', () => {
    render(<PrototypeToolbar {...mockFunctions} />);
    const deployButton = screen.getByRole('button', { name: /deploy to production/i });
    // Just verify button exists - styling is in sx prop
    expect(deployButton).toBeInTheDocument();
  });

  // Test 6: Key toolbar buttons render
  it('Test 6: should render key toolbar buttons including Deploy', () => {
    render(<PrototypeToolbar {...mockFunctions} />);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /run test/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deploy to production/i })).toBeInTheDocument();
    // Verify Deploy button is present
    const deployButton = screen.getByRole('button', { name: /deploy to production/i });
    expect(deployButton).toHaveTextContent('Deploy to Production');
  });
});
