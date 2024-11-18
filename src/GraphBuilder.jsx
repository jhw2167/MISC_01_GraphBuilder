import React, { useState, useEffect, useRef } from 'react';
import nodesData from './data.json';
import Node from './Node';

const COLORS = {
  BLUE: '#bfdbfe',
  RED: '#fecaca',
  GREEN: '#bbf7d0',
  GREY: '#e2e8f0',
  YELLOW: '#fef08a',
  PURPLE: '#e9d5ff'
};

const GRID = {
  ROWS: 5,
  COLUMNS: 50,
  NODE_WIDTH: 150,
  NODE_HEIGHT: 100,
  VERTICAL_SPACING: 120,
  HORIZONTAL_SPACING: 250,
  BUFFER_TOP: 50,
  BUFFER_SIDE: 50
};

const GraphBuilder = () => {
  const initialNodes = nodesData.nodes;

  const [nodes, setNodes] = useState(initialNodes);
  const [dragging, setDragging] = useState(null);
  const [positions, setPositions] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [dummyNode, setDummyNode] = useState(null);
  const [nodeHistory, setNodeHistory] = useState({});
  const canvasRef = useRef(null);

  // Initialize node positions
  useEffect(() => {
    const newPositions = {};
    nodes.forEach((node, index) => {
      if (!positions[node.id]) {
        const col = Math.min(index, GRID.COLUMNS - 1);
        const row = 0;
        newPositions[node.id] = {
          x: GRID.BUFFER_SIDE + col * GRID.HORIZONTAL_SPACING,
          y: GRID.BUFFER_TOP + row * GRID.VERTICAL_SPACING,
          positionX: col,
          positionY: row
        };
      }
    });
    setPositions({ ...positions, ...newPositions });
  }, [nodes]);

  const snapToGrid = (x, y) => {
    const col = Math.round((x - GRID.BUFFER_SIDE) / GRID.HORIZONTAL_SPACING);
    const row = Math.round((y - GRID.BUFFER_TOP) / GRID.VERTICAL_SPACING);
    
    const snappedCol = Math.max(0, Math.min(col, GRID.COLUMNS - 1));
    const snappedRow = Math.max(0, Math.min(row, GRID.ROWS - 1));
    
    return {
      x: GRID.BUFFER_SIDE + snappedCol * GRID.HORIZONTAL_SPACING,
      y: GRID.BUFFER_TOP + snappedRow * GRID.VERTICAL_SPACING,
      positionX: snappedCol,
      positionY: snappedRow
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
      if (pos && (!dragging || node.id !== dragging)) {
        ctx.fillStyle = node.color || '#e2e8f0';
        ctx.fillRect(pos.x, pos.y, GRID.NODE_WIDTH, GRID.NODE_HEIGHT);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(pos.x, pos.y, GRID.NODE_WIDTH, GRID.NODE_HEIGHT);
        
        // Draw node content
        ctx.fillStyle = '#000000';
        ctx.font = '16px sans-serif';
        ctx.fillText(`${node.icon} ${node.title}`, pos.x + 10, pos.y + 30);
        ctx.font = '12px sans-serif';
        ctx.fillText(node.description, pos.x + 10, pos.y + 50);
      }
    });

    // Draw dummy node if dragging
    if (dummyNode) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(dummyNode.x, dummyNode.y, GRID.NODE_WIDTH, GRID.NODE_HEIGHT);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(dummyNode.x, dummyNode.y, GRID.NODE_WIDTH, GRID.NODE_HEIGHT);
      ctx.globalAlpha = 1.0;
    }
  }, [positions, nodes]);

  const handleNodeClick = (nodeId) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const handleDisconnect = (nodeId) => {
    const updatedNodes = nodes.map(node => ({
      ...node,
      previous: node.previous ? node.previous.filter(id => id !== nodeId) : []
    }));

    setNodeHistory(prev => ({
      ...prev,
      [nodeId]: nodes
    }));
    
    setNodes(updatedNodes);
  };

  const handleUndo = (nodeId) => {
    if (nodeHistory[nodeId]) {
      setNodes(nodeHistory[nodeId]);
      setNodeHistory(prev => {
        const { [nodeId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleColorChange = (nodeId) => {
    const colorKeys = Object.keys(COLORS);
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        const currentColorIndex = colorKeys.findIndex(key => COLORS[key] === node.color);
        const nextColorIndex = (currentColorIndex + 1) % colorKeys.length;
        return {
          ...node,
          color: COLORS[colorKeys[nextColorIndex]]
        };
      }
      return node;
    }));
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodes.find(node => {
      const pos = positions[node.id];
      return pos &&
        x >= pos.x && x <= pos.x + GRID.NODE_WIDTH &&
        y >= pos.y && y <= pos.y + GRID.NODE_HEIGHT;
    });

    if (clickedNode) {
      setDragging(clickedNode.id);
      setDummyNode({
        id: 'dummy',
        x: positions[clickedNode.id].x,
        y: positions[clickedNode.id].y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (dragging && dummyNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDummyNode(prev => ({
        ...prev,
        x: e.clientX - rect.left - GRID.NODE_WIDTH / 2,
        y: e.clientY - rect.top - GRID.NODE_HEIGHT / 2
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragging && dummyNode) {
      const snappedPos = snapToGrid(dummyNode.x, dummyNode.y);
      setPositions(prev => ({
        ...prev,
        [dragging]: snappedPos
      }));
      setDummyNode(null);
      setDragging(null);
    }
  };

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #e2e8f0', 
      borderRadius: '0.5rem',
      width: '100%',
      overflowX: 'auto',
      position: 'relative'
    }}>
      {nodes.map(node => {
        const pos = positions[node.id];
        if (pos) {
          return (
            <div key={node.id} style={{ position: 'absolute', left: pos.x, top: pos.y }}>
              <Node
                node={node}
                position={pos}
                isSelected={selectedNode === node.id}
                onDisconnect={() => handleDisconnect(node.id)}
                onUndo={() => handleUndo(node.id)}
                onColorChange={() => handleColorChange(node.id)}
                onClick={() => handleNodeClick(node.id)}
              />
            </div>
          );
        }
        return null;
      })}
      <canvas
        ref={canvasRef}
        width={GRID.BUFFER_SIDE * 2 + (GRID.COLUMNS - 1) * GRID.HORIZONTAL_SPACING}
        height={GRID.BUFFER_TOP * 2 + (GRID.ROWS - 1) * GRID.VERTICAL_SPACING}
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
