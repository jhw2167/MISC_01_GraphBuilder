import React, { useState, useEffect, useRef } from 'react';
import { Node } from './Node';
import { NodeState, COLORS } from './NodeState';
import { DEFAULT_OPTIONS } from './NodeOptions';
import { NodeOptionsPanel } from './NodeOptionsPanel';
import initialData from './assets/data.json';
import techData from './assets/techTree.json';

export const GraphCanvas = () => {

    /* Constants */
    const GRID = {
        ROWS: 5,
        COLUMNS: 50,
        NODE_WIDTH: 200,
        NODE_HEIGHT: 110,
        VERTICAL_SPACING: 160,
        HORIZONTAL_SPACING: 250,
        BUFFER_TOP: 30,
        BUFFER_SIDE: 50,
        CONTAINER_BUFFER_TOP: 50,
        CONTAINER_BUFFER_SIDE: 150
      };

    const disableVertexSelection = true;

    /* State */
    
    //Options state
    const [showOptionsPanel, setShowOptionsPanel] = useState(false);
    const [nodeOptions, setNodeOptions] = useState(DEFAULT_OPTIONS);
    const [selectedNodeOptions, setSelectedNodeOptions] = useState(null);
    
    //wxh
    const [dimensions, setDimensions] = useState([]);
    const [selected, setSelected] = useState([]); // Array of selected node IDs
    const [connectMode, setConnectMode] = useState(false);
    const [optionHovered, setOptionHovered] = useState(null);
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
        let data = initialData.nodes;
        let initialNodeStates = data.map(node => NodeState.fromJSON(node));

        let useTechData = false;
        if(useTechData)
        {
            data = techData.technologies;
            initialNodeStates = data.map(node => NodeState.fromJSONTechTree(node));
        }

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
        if (selected.length === 1) {
            const selectedNode = currentNodeStates.find(node => node.id === selected[0]);
            if (selectedNode) {
                setSelectedNodeOptions({
                    color: selectedNode.color,
                    icon: selectedNode.icon,
                    showDescription: true,
                    showSubtitle: true,
                    fontSize: "normal",
                    borderStyle: "solid"
                });
                setShowOptionsPanel(true);
            }
        } else {
            setSelectedNodeOptions(null);
            setShowOptionsPanel(false);
            setConnectMode(false);
        }
    }, [selected, currentNodeStates]);

    // Watch for current node state changes
    useEffect(() => {
        // Future implementation
        //Log the current node states as json
        if(currentNodeStates.length > 0)
        {
            //console.log(JSON.stringify(currentNodeStates, null, 2));
        }
            

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
            let newNodes = currentNodeStates.map(node => {
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
    const exportToJson = () => {
        const dataStr = JSON.stringify(currentNodeStates, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'out.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };


    const handleMouseDown = (e) => {
        // Get canvas coordinates
        const canvas = canvasRef.current;
        if (canvas && selected.length === 1)
        {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Check if click is on a vertex
            const clickedVertex = checkVertexClick(x, y);
            if (clickedVertex) {
                deleteVertex(clickedVertex);
                return;
            }
        }

        //if an option is hovered, return
        //console.log(optionHovered);
        if (optionHovered) 
            return;

        // Find if we clicked on a node
        const nodeElement = e.target.closest('[data-node-id]');
        if (!nodeElement) 
        {
            //console.log("no node element");
            setSelected([]);
            return;
        }

        const nodeId = nodeElement.dataset.nodeId;
        if (nodeId === "dummy") 
            return;

        //if the nodeId is not equal to the id currently selected, call connectNodes and return
        if (selected.length === 1 && selected[0] !== nodeId) 
        {
            if( connectMode ) 
            {
                let alreadyConnected = connectNodes(selected[0], nodeId);
                if(alreadyConnected) {
                    //skip return
                } else {
                    return;
                }
                
            }
                
        }

        // Select the node
        setSelected([nodeId]);

        // Start dragging immediately
        const node = currentNodeStates.find(node => node.id === nodeId);
        if (node) 
        {
            const posX = parseInt(node.posX) * GRID.HORIZONTAL_SPACING + GRID.BUFFER_SIDE;
            const posY = parseInt(node.posY) * GRID.VERTICAL_SPACING + GRID.BUFFER_TOP;

            let nodeState = new NodeState(
                "dummy",
                node.color,
                posX,
                posY,
                node.title,
                node.subtitle,
                [],
                node.descr,
                node.icon
            );
            //log the posx and y
            //console.log(node.posX + "  " + node.posY);
            setDummyNode(nodeState);
        }
    };
    
    const handleMouseMove = (e) => {
        if (dummyNode) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - GRID.NODE_WIDTH / 2;
            const y = e.clientY - rect.top - GRID.NODE_HEIGHT / 2;
            
            if (dummyNode) {
                setDummyNode(new NodeState(
                    "dummy",
                    dummyNode.color,
                    x,
                    y,
                    dummyNode.title,
                    dummyNode.subtitle,
                    [],
                    dummyNode.descr,
                    dummyNode.icon
                ));
            }
        }
    };
    
    const handleMouseLeave = () => {
        setDummyNode(null);
    }

    const handleMouseUp = () => {
        if (dummyNode) {
            const snappedPos = snapToGrid(dummyNode.posX, dummyNode.posY);
            const originalNode = currentNodeStates.find(node => node.id === selected[0]);
            
            if (originalNode) {
                const updatedNode = structuredClone(originalNode);
                updatedNode.posX = snappedPos.posX;
                updatedNode.posY = snappedPos.posY;
                setNewNodeStates([updatedNode]);
            }
            
            
        }
        setDummyNode(null);
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

      const isSelected = (nodeId) => {
        if (!nodeId) return false;
        return Array.isArray(selected) && selected.includes(nodeId);
      };

    //connect two nodes with a vertice, returns true if the nodes are already connected or we dont' want to connect them
      const connectNodes = (sourceId, targetId) => {
        const sourceNode = currentNodeStates.find(node => node.id === sourceId);
        const targetNode = currentNodeStates.find(node => node.id === targetId);
        
        if (!sourceNode || !targetNode) 
            return true;

        const updatedTarget = structuredClone(targetNode);
        const updatedSource = structuredClone(sourceNode);

        let targetLinked = updatedTarget.previous.includes(sourceId);
        let sourceLinked = updatedSource.previous.includes(targetId);

        if(targetLinked || sourceLinked)
        {
            return true; //short circuit if the nodes are already connected
        }   
            

        // Determine which node is leftmost
        const sourcePosX = parseInt(sourceNode.posX);
        const targetPosX = parseInt(targetNode.posX);
        
        // Add connection from left node to right node
        if (sourcePosX <= targetPosX) {
            updatedTarget.previous.push(sourceId);
            setNewNodeStates([updatedTarget]);
        } else {
            updatedSource.previous.push(targetId);
            setNewNodeStates([updatedSource]);
        }
        
        return false;
      };

      const checkVertexClick = (x, y) => {
        const canvas = canvasRef.current;
        
        if (!canvas || disableVertexSelection) 
            return null;

        for (const [sourceId, targetId] of vertices) {
            const sourceNode = currentNodeStates.find(node => node.id === sourceId);
            const targetNode = currentNodeStates.find(node => node.id === targetId);
            
            if (sourceNode && targetNode) {
                const startX = GRID.BUFFER_SIDE + (parseInt(sourceNode.posX) * GRID.HORIZONTAL_SPACING) + GRID.NODE_WIDTH/2;
                const startY = GRID.BUFFER_TOP + (parseInt(sourceNode.posY) * GRID.VERTICAL_SPACING) + GRID.NODE_HEIGHT/2;
                const endX = GRID.BUFFER_SIDE + (parseInt(targetNode.posX) * GRID.HORIZONTAL_SPACING) + GRID.NODE_WIDTH/2;
                const endY = GRID.BUFFER_TOP + (parseInt(targetNode.posY) * GRID.VERTICAL_SPACING) + GRID.NODE_HEIGHT/2;

                // Calculate distance from click to line
                const lineLength = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
                const distance = Math.abs((endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX) / lineLength;

                // Check if click is within 5 pixels of the line
                if (distance < 5) {
                    // Check if click is between start and end points
                    const dotProduct = ((x - startX) * (endX - startX) + (y - startY) * (endY - startY)) / (lineLength * lineLength);
                    if (dotProduct >= 0 && dotProduct <= 1) {
                        return [sourceId, targetId];
                    }
                }
            }
        }
        return null;
    };

    const deleteVertex = (vertex) => {
        if (!vertex) return;
        
        const [sourceId, targetId] = vertex;
        const targetNode = currentNodeStates.find(node => node.id === targetId);
        
        if (targetNode) {
            const updatedTarget = structuredClone(targetNode);
            updatedTarget.previous = updatedTarget.previous.filter(id => id !== sourceId);
            setNewNodeStates([updatedTarget]);
            //setVertices(vertices.filter(([s, t]) => !(s === sourceId && t === targetId)));
        }
    };

    const handleOptionChange = (optionKey, value) => {
        if (selected.length === 1) {
            const updatedOptions = { ...selectedNodeOptions, [optionKey]: value };
            setSelectedNodeOptions(updatedOptions);
            
            const selectedNode = currentNodeStates.find(node => node.id === selected[0]);
            if (selectedNode) {
                const updatedNode = structuredClone(selectedNode);
                
                // Apply the option change to the node
                switch(optionKey) {
                    case 'color':
                        updatedNode.color = COLORS[value] || value;
                        break;
                    case 'icon':
                        updatedNode.icon = value;
                        break;
                    // Add other option handlers as needed
                }
                
                setNewNodeStates([updatedNode]);
            }
        }
    };

      /* ##################### */
      /* ##################### */
      /* ##################### */

    const drawVertices = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        vertices.forEach(([sourceId, targetId]) => {
            const sourceNode = currentNodeStates.find(node => node.id === sourceId);
            const targetNode = currentNodeStates.find(node => node.id === targetId);
            
            if (sourceNode && targetNode) {
                const startX = GRID.BUFFER_SIDE + (parseInt(sourceNode.posX) * GRID.HORIZONTAL_SPACING) + GRID.NODE_WIDTH/2;
                const startY = GRID.BUFFER_TOP + (parseInt(sourceNode.posY) * GRID.VERTICAL_SPACING) + GRID.NODE_HEIGHT/2;
                const endX = GRID.BUFFER_SIDE + (parseInt(targetNode.posX) * GRID.HORIZONTAL_SPACING) + GRID.NODE_WIDTH/2;
                const endY = GRID.BUFFER_TOP + (parseInt(targetNode.posY) * GRID.VERTICAL_SPACING) + GRID.NODE_HEIGHT/2;

                // Draw right-angle path
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                
                // Calculate midpoint for the right angle
                const midX = startX + (endX - startX) / 2;
                
                // Draw the three segments
                ctx.lineTo(midX, startY); // Horizontal line from start
                ctx.lineTo(midX, endY);   // Vertical line
                ctx.lineTo(endX, endY);   // Horizontal line to end
                
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw delete button if a node is selected
                if (selected.length === 1 && !disableVertexSelection) 
                {
                    // Calculate midpoint of the path
                    const deleteX = midX;
                    const deleteY = (startY + endY) / 2;
                    
                    ctx.beginPath();
                    ctx.arc(deleteX, deleteY, 15, 0, 2 * Math.PI);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                }

                // Draw arrow head
                const angle = Math.atan2(endY - startY, endX - startX);
                const arrowLength = 15;
                const arrowWidth = 8;

                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(
                    endX - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
                    endY - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
                );
                ctx.lineTo(
                    endX - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
                    endY - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
                );
                ctx.closePath();
                ctx.fillStyle = '#000000';
                ctx.fill();
            }
        });
    };

    // Add effect to redraw vertices when they change
    useEffect(() => {
        drawVertices();
    }, [vertices, currentNodeStates, selected]);

    return (
        <div id='graph-canvas'
        style={{ 
            padding: '1rem', 
            border: '1px solid black', 
            borderRadius: '0.5rem',
            width: '90vw',
            height: '90vh',
            overflowX: 'auto',
            position: 'relative',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button
                onClick={exportToJson}
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                Export JSON
            </button>
        <div  
        style={{
            //border: '1px solid black', 
            position: 'relative',
            cursor: dummyNode ? 'grabbing' : 'pointer',
            width: 'inherit',
            height: 'inherit',
        }}   
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
            <canvas
                ref={canvasRef}
                width={dimensions[0]}
                height={dimensions[1]}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}

            />
            {currentNodeStates.map(nodeState => {
                const isNodeSelected = isSelected(nodeState.id) || false;
                return (
                    <React.Fragment key={nodeState.id}>
                        <Node 
                            nodeState={nodeState}
                            grid={GRID}
                            isSelected={isNodeSelected}
                        />
                        {isNodeSelected && (
                            <NodeOptionsPanel 
                                options={{
                                    color: Object.keys(COLORS).find(key => COLORS[key] === nodeState.color) || 'grey',
                                    icon: nodeState.icon
                                }}
                                onOptionChange={handleOptionChange}
                                onDisconnectAll={() => {
                                    const updatedNode = structuredClone(nodeState);
                                    updatedNode.previous = [];
                                    console.log(updatedNode);
                                    setNewNodeStates([updatedNode]);
                                }}
                                onToggleConnectMode={() => setConnectMode(!connectMode)}
                                onOptionHover={(opt) => setOptionHovered(opt)}
                                style={{
                                    position: 'absolute',
                                    left: `${GRID.BUFFER_SIDE + (parseInt(nodeState.posX) * GRID.HORIZONTAL_SPACING) + GRID.NODE_WIDTH/2}px`,
                                    top: `${GRID.BUFFER_TOP + (parseInt(nodeState.posY) * GRID.VERTICAL_SPACING) - 48 }px`
                                }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
            
            {dummyNode && (
                (dummyNode instanceof NodeState) &&
                <Node 
                    nodeState={dummyNode}
                    grid={GRID}
                    isSelected={false}
                />
            )}
        </div>
    </div>
    );
};
