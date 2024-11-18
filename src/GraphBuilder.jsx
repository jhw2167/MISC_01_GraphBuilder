import React, { useState, useEffect, useRef } from 'react';
import nodesData from './data.json';

const COLORS = {
  BLUE: '#bfdbfe',
  RED: '#fecaca',
  GREEN: '#bbf7d0',
  GREY: '#e2e8f0',
  YELLOW: '#fef08a',
  PURPLE: '#e9d5ff'
};

const GRID = {
  ROWS: 6,
  COLUMNS: 50,
  NODE_WIDTH: 150,
  NODE_HEIGHT: 100,
  VERTICAL_SPACING: 120,
  HORIZONTAL_SPACING: 170
};

const GraphBuilder = () => {
  const initialNodes = nodesData.nodes;

  const [nodes, setNodes] = useState(initialNodes);
  const [dragging, setDragging] = useState(null);
  const [positions, setPositions] = useState({});
  const canvasRef = useRef(null);

  // Initialize node positions
  useEffect(() => {
    const newPositions = {};
    nodes.forEach((node, index) => {
      if (!positions[node.id]) {
        newPositions[node.id] = {
          x: Math.min(index * GRID.HORIZONTAL_SPACING, (GRID.COLUMNS - 1) * GRID.HORIZONTAL_SPACING),
          y: GRID.VERTICAL_SPACING
        };
      }
    });
    setPositions({ ...positions, ...newPositions });
  }, [nodes]);

  const snapToGrid = (x, y) => {
    const col = Math.round(x / GRID.HORIZONTAL_SPACING);
    const row = Math.round(y / GRID.VERTICAL_SPACING);
    
    return {
      x: Math.max(0, Math.min(col * GRID.HORIZONTAL_SPACING, (GRID.COLUMNS - 1) * GRID.HORIZONTAL_SPACING)),
      y: Math.max(0, Math.min(row * GRID.VERTICAL_SPACING, (GRID.ROWS - 1) * GRID.VERTICAL_SPACING))
    };
  };

  // Draw connections and nodes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections first
    ctx.beginPath();
    nodes.forEach(node => {
      if (node.previous) {
        node.previous.forEach(prevId => {
          const start = positions[prevId];
          const end = positions[node.id];
          if (start && end) {
            ctx.moveTo(start.x + 75, start.y + 50);
            ctx.lineTo(end.x + 75, end.y + 50);
          }
        });
      }
    });
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();

    // Draw nodes
    nodes.forEach(node => {
      const pos = positions[node.id];
      if (pos) {
        ctx.fillStyle = node.color || '#e2e8f0';
        ctx.fillRect(pos.x, pos.y, 150, 100);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(pos.x, pos.y, 150, 100);
        
        // Draw node content
        ctx.fillStyle = '#000000';
        ctx.font = '16px sans-serif';
        ctx.fillText(`${node.icon} ${node.title}`, pos.x + 10, pos.y + 30);
        ctx.font = '12px sans-serif';
        ctx.fillText(node.description, pos.x + 10, pos.y + 50);
      }
    });
  }, [positions, nodes]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a node
    const clickedNode = nodes.find(node => {
      const pos = positions[node.id];
      return pos &&
        x >= pos.x && x <= pos.x + 150 &&
        y >= pos.y && y <= pos.y + 100;
    });

    if (clickedNode) {
      setDragging(clickedNode.id);
    }
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      setPositions(prev => ({
        ...prev,
        [dragging]: {
          x: e.clientX - rect.left - 75,
          y: e.clientY - rect.top - 50
        }
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      const currentPos = positions[dragging];
      const snappedPos = snapToGrid(currentPos.x, currentPos.y);
      setPositions(prev => ({
        ...prev,
        [dragging]: snappedPos
      }));
    }
    setDragging(null);
  };

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #e2e8f0', 
      borderRadius: '0.5rem',
      width: '100%',
      overflowX: 'auto'
    }}>
      <canvas
        ref={canvasRef}
        width={GRID.COLUMNS * GRID.HORIZONTAL_SPACING}
        height={GRID.ROWS * GRID.VERTICAL_SPACING}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          cursor: dragging ? 'grabbing' : 'grab',
          minWidth: '100%'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default GraphBuilder;
