import React, { useState, useEffect, useRef } from 'react';

const GraphBuilder = () => {
  // Sample data structure
  const initialNodes = [
    {
      id: '1',
      icon: '📄',
      title: 'Start',
      description: 'Beginning node',
      previous: [],
      color: '#e2e8f0'
    },
    {
      id: '2',
      icon: '📝',
      title: 'Process',
      description: 'Processing node',
      previous: ['1'],
      color: '#bfdbfe'
    },
    {
      id: '3',
      icon: '✅',
      title: 'End',
      description: 'Final node',
      previous: ['2'],
      color: '#bbf7d0'
    }
  ];

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
          x: 100 + (index * 200),
          y: 150
        };
      }
    });
    setPositions({ ...positions, ...newPositions });
  }, [nodes]);

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
    setDragging(null);
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          cursor: dragging ? 'grabbing' : 'grab'
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