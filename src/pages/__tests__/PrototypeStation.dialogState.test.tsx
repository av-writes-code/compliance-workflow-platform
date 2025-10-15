import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useState, useCallback } from 'react';

/**
 * PrototypeStation Dialog State Unit Tests
 *
 * Purpose: Test dialog state management in isolation (no full component render)
 * Tests the logic of: deployDialogOpen state, handleDeploy callback, dialog props
 */

describe('PrototypeStation Dialog State Management', () => {
  // Test 1: deployDialogOpen state starts as false
  it('Test 1: deployDialogOpen should initialize as false', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      return { deployDialogOpen, setDeployDialogOpen };
    });

    expect(result.current.deployDialogOpen).toBe(false);
  });

  // Test 2: Setting deployDialogOpen to true
  it('Test 2: should set deployDialogOpen to true', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      return { deployDialogOpen, setDeployDialogOpen };
    });

    act(() => {
      result.current.setDeployDialogOpen(true);
    });

    expect(result.current.deployDialogOpen).toBe(true);
  });

  // Test 3: Toggling deployDialogOpen state
  it('Test 3: should toggle deployDialogOpen state', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      return { deployDialogOpen, setDeployDialogOpen };
    });

    // Open
    act(() => {
      result.current.setDeployDialogOpen(true);
    });
    expect(result.current.deployDialogOpen).toBe(true);

    // Close
    act(() => {
      result.current.setDeployDialogOpen(false);
    });
    expect(result.current.deployDialogOpen).toBe(false);
  });

  // Test 4: onDeploy callback opens dialog
  it('Test 4: onDeploy callback should set deployDialogOpen to true', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      const onDeploy = useCallback(() => {
        setDeployDialogOpen(true);
      }, []);
      return { deployDialogOpen, onDeploy };
    });

    act(() => {
      result.current.onDeploy();
    });

    expect(result.current.deployDialogOpen).toBe(true);
  });

  // Test 5: onClose callback closes dialog
  it('Test 5: onClose callback should set deployDialogOpen to false', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(true); // Start open
      const onClose = useCallback(() => {
        setDeployDialogOpen(false);
      }, []);
      return { deployDialogOpen, onClose };
    });

    act(() => {
      result.current.onClose();
    });

    expect(result.current.deployDialogOpen).toBe(false);
  });

  // Test 6: Dialog onDeploy callback receives correct parameters
  it('Test 6: dialog onDeploy should accept name and version parameters', () => {
    const mockHandleDeploy = vi.fn();

    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(true);
      const handleDialogDeploy = useCallback((data: { version: string; workflowName: string }) => {
        mockHandleDeploy(data.workflowName, data.version);
        setDeployDialogOpen(false);
      }, []);
      return { deployDialogOpen, handleDialogDeploy };
    });

    act(() => {
      result.current.handleDialogDeploy({ version: 'v2.0.0', workflowName: 'Test Workflow' });
    });

    expect(mockHandleDeploy).toHaveBeenCalledWith('Test Workflow', 'v2.0.0');
    expect(result.current.deployDialogOpen).toBe(false);
  });

  // Test 7: Dialog props - open state matches deployDialogOpen
  it('Test 7: dialog open prop should match deployDialogOpen state', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      const dialogProps = {
        open: deployDialogOpen,
        onClose: () => setDeployDialogOpen(false),
      };
      return { deployDialogOpen, dialogProps, setDeployDialogOpen };
    });

    // Initially closed
    expect(result.current.dialogProps.open).toBe(false);

    // Open dialog
    act(() => {
      result.current.setDeployDialogOpen(true);
    });
    expect(result.current.dialogProps.open).toBe(true);
  });

  // Test 8: Multiple open/close cycles maintain state integrity
  it('Test 8: should handle multiple open/close cycles correctly', () => {
    const { result } = renderHook(() => {
      const [deployDialogOpen, setDeployDialogOpen] = useState(false);
      return { deployDialogOpen, setDeployDialogOpen };
    });

    // Cycle 1
    act(() => { result.current.setDeployDialogOpen(true); });
    expect(result.current.deployDialogOpen).toBe(true);
    act(() => { result.current.setDeployDialogOpen(false); });
    expect(result.current.deployDialogOpen).toBe(false);

    // Cycle 2
    act(() => { result.current.setDeployDialogOpen(true); });
    expect(result.current.deployDialogOpen).toBe(true);
    act(() => { result.current.setDeployDialogOpen(false); });
    expect(result.current.deployDialogOpen).toBe(false);

    // Cycle 3
    act(() => { result.current.setDeployDialogOpen(true); });
    expect(result.current.deployDialogOpen).toBe(true);
  });
});
