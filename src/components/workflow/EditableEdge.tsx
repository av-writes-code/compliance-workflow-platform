import { useState, useCallback, useEffect } from 'react';
import { EdgeProps, BaseEdge, useReactFlow } from 'reactflow';

export default function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps) {
  const { setEdges, screenToFlowPosition } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);

  const executionState = data?.executionState || 'idle'; // 'idle' | 'active' | 'completed'
  // Support both branchLabel (runtime) and label (template) properties
  const branchLabel = data?.branchLabel || (data as any)?.label;
  const isInExecutionPath = data?.isInExecutionPath || false; // Step-through: in execution path
  const isCompletedPath = data?.isCompletedPath || false; // Step-through: completed path

  // Calculate default center point
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  // Get control point as ABSOLUTE position (not offset)
  const controlPoint = data?.controlPoint || { x: centerX, y: centerY };

  // Use QUADRATIC bezier - the control point influences the curve
  const edgePath = `M ${sourceX},${sourceY} Q ${controlPoint.x},${controlPoint.y} ${targetX},${targetY}`;

  // Calculate the actual point ON the curve at t=0.5 (midpoint of the bezier)
  // Quadratic bezier formula: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
  const t = 0.5;
  const pointOnCurve = {
    x: (1 - t) * (1 - t) * sourceX + 2 * (1 - t) * t * controlPoint.x + t * t * targetX,
    y: (1 - t) * (1 - t) * sourceY + 2 * (1 - t) * t * controlPoint.y + t * t * targetY,
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    // Convert screen coordinates to flow coordinates
    const flowPosition = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });

    // Store absolute position directly
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: {
                ...edge.data,
                controlPoint: flowPosition,
              },
            }
          : edge
      )
    );
  }, [isDragging, id, setEdges, screenToFlowPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Determine edge styling based on execution state and step-through state
  const getEdgeStyle = () => {
    const baseStyle = { ...style };

    // Step-through takes precedence over regular execution state
    if (isCompletedPath) {
      return {
        ...baseStyle,
        stroke: '#22c55e',
        strokeWidth: 2.5,
      };
    }

    if (isInExecutionPath) {
      return {
        ...baseStyle,
        stroke: '#818cf8',
        strokeWidth: 2.5,
        strokeDasharray: '5,5',
      };
    }

    // Regular execution states
    switch (executionState) {
      case 'active':
        return {
          ...baseStyle,
          stroke: '#22c55e',
          strokeWidth: 2.5,
        };
      case 'completed':
        return {
          ...baseStyle,
          stroke: '#6366f1',
          strokeWidth: 2,
        };
      default:
        return {
          ...baseStyle,
          strokeWidth: selected ? 2 : 1.5,
          opacity: isInExecutionPath === false && isCompletedPath === false ? 0.3 : 1,
        };
    }
  };

  const getArrowColor = () => {
    if (isCompletedPath) return '#22c55e';
    if (isInExecutionPath) return '#818cf8';
    if (executionState === 'active') return '#22c55e';
    if (executionState === 'completed') return '#6366f1';
    return selected ? '#818cf8' : '#6366f1';
  };

  return (
    <>
      {/* Definitions */}
      <defs>
        {/* Arrow marker */}
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 20 20"
          refX="18"
          refY="10"
          markerWidth="12"
          markerHeight="12"
          orient="auto"
        >
          <path
            d="M 0 5 L 10 10 L 0 15 L 4 10 z"
            fill={getArrowColor()}
            stroke="none"
          />
        </marker>

        {/* Animated flow gradient for active state */}
        {executionState === 'active' && (
          <linearGradient id={`flow-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="-1; -1; 1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#22c55e" stopOpacity="1">
              <animate
                attributeName="offset"
                values="-0.5; -0.5; 1.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3">
              <animate
                attributeName="offset"
                values="0; 0; 2"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        )}
      </defs>

      {/* Animated flow path (behind main edge, only for active state) */}
      {executionState === 'active' && (
        <path
          d={edgePath}
          fill="none"
          stroke={`url(#flow-gradient-${id})`}
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
      )}

      {/* Main edge path */}
      <BaseEdge
        path={edgePath}
        markerEnd={`url(#arrow-${id})`}
        style={getEdgeStyle()}
      />

      {/* Source endpoint handle - visible when selected */}
      {selected && (
        <g>
          <circle
            cx={sourceX}
            cy={sourceY}
            r={8}
            fill="#10b981"
            stroke="white"
            strokeWidth={2}
            style={{
              cursor: 'grab',
              opacity: 1,
            }}
            pointerEvents="all"
          />
        </g>
      )}

      {/* Target endpoint handle - visible when selected */}
      {selected && (
        <g>
          <circle
            cx={targetX}
            cy={targetY}
            r={8}
            fill="#6366f1"
            stroke="white"
            strokeWidth={2}
            style={{
              cursor: 'grab',
              opacity: 1,
            }}
            pointerEvents="all"
          />
        </g>
      )}

      {/* Branch label (for decision nodes) */}
      {branchLabel && (
        <g>
          <text
            x={pointOnCurve.x}
            y={pointOnCurve.y - 15}
            fill="white"
            fontSize="11"
            fontWeight="500"
            textAnchor="middle"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <tspan
              fill={executionState === 'active' ? '#22c55e' : executionState === 'completed' ? '#818cf8' : 'rgba(255, 255, 255, 0.6)'}
            >
              {branchLabel}
            </tspan>
          </text>
        </g>
      )}

      {/* Middle control point - for reshaping curve */}
      <g>
        <circle
          cx={pointOnCurve.x}
          cy={pointOnCurve.y}
          r={5}
          fill="#a855f7"
          stroke="white"
          strokeWidth={2}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            opacity: selected || isDragging ? 1 : 0.7,
            transition: isDragging ? 'none' : 'opacity 0.2s',
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.setAttribute('r', '7');
              e.currentTarget.style.opacity = '1';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.setAttribute('r', '5');
              e.currentTarget.style.opacity = selected ? '1' : '0.7';
            }
          }}
          className="nodrag nopan"
          pointerEvents="all"
        />
      </g>
    </>
  );
}
