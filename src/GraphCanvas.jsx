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
        BUFFER_SIDE: 50,
        CONTAINER_BUFFER_TOP: 50,
        CONTAINER_BUFFER_SIDE: 150
      };

    /* State */

    //wxh
    const [dimensions, setDimensions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [dragging, setDragging] = useState(null);
    const [dummyNode, setDummyNode] = useState(null);

    const [currentNodeStates, setCurrentNodeStates] = useState([]);
    const [newNodeStates, setNewNodeStates] = useState([]);
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
        
        if( vertices.length > 0)
            return;

        let newVerticies = [];
        currentNodeStates.forEach(node => {
            
            if (node.previous && node.previous.length > 0) 
            {
                node.previous.forEach(edge => {
                    newVerticies.push([edge, node.id]);
                });
            }
        });

        if(newVerticies.length > 0)
            setVertices(newVerticies);

    }, [vertices]);

    //create a useEffect to establish new nodes by copying the currentNodeState
    useEffect(() => {
        if (newNodeStates.length > 0) 
        {
            //map a new array of the current node states pushing the updated state or the existing one
            newNodes = currentNodeStates.map(node => {
                const newNode = newNodeStates.find(n => n.id === node.id);
                return newNode ? newNode : node;
            });
            history.push(newNodes);
            setHistoryHead(history.length - 1);
        }
    }, [newNodeStates]);

      /* ##################### */
    /* ##################### */
    /* ##################### */


    /* Functions */

    const handleNodeSelect = (nodeId) => {
        //check if selcted already contains id:
        console.log("selected id " + nodeId);
        if( !selected )
            return;

        //log the object type of selected
        console.log("selected type " + typeof selected);

        if (selected.indexOf(nodeId) > -1)
            return;
    
        setSelected(prev => structuredClone(prev).push(nodeId));
        console.log("selected type after" + typeof selected);
        
    };

    const handleMouseDown = (e) => {
       
        //get the node at the 0 index of selected
        if(!selected || selected.length == undefined || selected.length === 0)
            return;
        
        console.log("selected length " + selected.length);
        let id = selected.length > 0 ? selected[0] : -1;

        if(id === -1)
            return;

        console.log("id" + id);
        let n = currentNodeStates.find(node => node.id === id);
        

        if (n) {
          setDragging(id);
          let nodeState = NodeState.fromJSON({"id": "dummy",
             "color": n.color,
             "posX": n.posX,
             "posY": n.posY,
             "title": n.title,
             "description": n.descr,
             "icon": n.icon
            });
          setDummyNode(nodeState);
        }
      };
    
      const handleMouseMove = (e) => {
        if (dragging && dummyNode) 
        {
            //console.log(e.clientX + " " + e.clientY);
            
            setDummyNode(prev => { 
                let ns = prev;
                ns.posX = e.clientX - GRID.CONTAINER_BUFFER_SIDE;
                ns.posY = e.clientY - GRID.CONTAINER_BUFFER_TOP;
                return ns;
            });
        }
      };
    
      const handleMouseUp = () => {
        if (dragging && dummyNode) 
        {
            const snappedPos = snapToGrid(dummyNode.posX, dummyNode.posY);
            console.log("snappedPos");
            console.log(snappedPos);

            let node = currentNodeStates.find(node => node.id === dragging);
            node.posX = snappedPos.posX;
            node.posY = snappedPos.posY;
            setNewNodeStates([node]);

            setDummyNode(null);
            setDragging(null);
        }
      };

      const snapToGrid = (x, y) => {
        const col = Math.round((x - GRID.BUFFER_SIDE) / GRID.HORIZONTAL_SPACING);
        const row = Math.round((y - GRID.BUFFER_TOP) / GRID.VERTICAL_SPACING);
        
        const snappedCol = Math.max(0, Math.min(col, GRID.COLUMNS - 1));
        const snappedRow = Math.max(0, Math.min(row, GRID.ROWS - 1));
        
        return {
          x: GRID.BUFFER_SIDE + snappedCol * GRID.HORIZONTAL_SPACING,
          y: GRID.BUFFER_TOP + snappedRow * GRID.VERTICAL_SPACING,
          posX: snappedCol,
          posY: snappedRow
        };
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
        //onMouseDown={handleMouseDown}
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
            
            {dummyNode && (
                <Node 
                    nodeState={dummyNode}
                    grid={GRID}
                />
            )}
        </div>
    </div>
    );
};
