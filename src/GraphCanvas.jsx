import React, { useState, useEffect, useRef } from 'react';
import { Node } from './Node';
import { NodeState } from './NodeState';
import initialData from './data.json';

export const GraphCanvas = () => {

    /* Types */



    /* Constants */
    const GRID = {
        ROWS: 5,
        COLUMNS: 50,
        NODE_WIDTH: 150,
        NODE_HEIGHT: 100,
        VERTICAL_SPACING: 115,
        HORIZONTAL_SPACING: 250,
        BUFFER_TOP: 30,
        BUFFER_SIDE: 50
      };

    /* State */

    //wxh
    const [dimensions, setDimensions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [currentNodeStates, setCurrentNodeStates] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyHead, setHistoryHead] = useState(0);
    const [vertices, setVertices] = useState([]);
    const canvasRef = useRef(null);

    /* ##################### */


    /* Effects */

    // Watch for dimensions changes
    useEffect(() => {
        let width=GRID.BUFFER_SIDE * 2 + (GRID.COLUMNS ) * GRID.HORIZONTAL_SPACING;
        let height=GRID.BUFFER_TOP * 2 + (GRID.ROWS ) * GRID.VERTICAL_SPACING;
        setDimensions([width, height]);

    }, []);

    // Initial data load
    useEffect(() => {
        const initialNodeStates = initialData.nodes.map(node => NodeState.fromJSON(node));
        setHistory([initialNodeStates]);
        setCurrentNodeStates(initialNodeStates);
    }, []);

    // Watch for history/head changes
    useEffect(() => {
        if (history.length > 0 && historyHead >= 0 && historyHead < history.length) {
            setCurrentNodeStates(history[historyHead]);
        }

        setVertices([]);

    }, [history, historyHead]);

    // Watch for selected nodes changes
    useEffect(() => {
        // Future implementation
    }, [selected]);

    // Watch for current node state changes
    useEffect(() => {
        // Future implementation
        //Log the current node states as json
        if(currentNodeStates.length > 0)
            console.log(JSON.stringify(currentNodeStates, null, 2));

    }, [currentNodeStates]);

    //use curretnNodeStates to set vertices
    useEffect(() => {
        currentNodeStates.forEach(node => {
            if (node.edges) {
                node.edges.forEach(edge => {
                    setVertices(prev => [...prev, edge]);
                });
            }
        }); 


    }, [vertices]);

    const handleNodeSelect = (nodeId) => {
        setSelected(prev => [...prev, nodeId]);
    };


    /* ##################### */
    /* ##################### */
    /* ##################### */

    /* Functions */

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

      /* ##################### */
      /* ##################### */
      /* ##################### */

    return (
        <div 
        style={{ 
            padding: '1rem', 
            border: '1px solid black', 
            borderRadius: '0.5rem',
            width: '80vw',
            height: '90vh',
            overflowX: 'auto',
            position: 'relative'
          }}>
        <div  
        style={{
            border: '1px solid black', 
            position: 'relative',
          cursor: dragging ? 'grabbing' : 'pointer',
            width: dimensions[0],
            height: dimensions[1]
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
            {currentNodeStates.map(nodeState => (
                <Node 
                    key={nodeState.id}
                    nodeState={nodeState}
                    onSelect={handleNodeSelect}
                    grid={GRID}
                />
            ))}
        </div>
    </div>
    );
};
