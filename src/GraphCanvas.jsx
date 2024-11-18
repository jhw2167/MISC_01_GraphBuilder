import React, { useState, useEffect } from 'react';
import { Node } from './Node';
import { NodeState } from './NodeState';
import initialData from './data.json';

export const GraphCanvas = () => {
    const [selected, setSelected] = useState([]);
    const [currentNodeStates, setCurrentNodeStates] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyHead, setHistoryHead] = useState(0);
    const [vertices, setVertices] = useState([]);

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
    }, [history, historyHead]);

    // Watch for selected nodes changes
    useEffect(() => {
        // Future implementation
    }, [selected]);

    // Watch for current node state changes
    useEffect(() => {
        // Future implementation
    }, [currentNodeStates]);

    // Watch for vertices changes
    useEffect(() => {
        // Future implementation
    }, [vertices]);

    const handleNodeSelect = (nodeId) => {
        setSelected(prev => [...prev, nodeId]);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {currentNodeStates.map(nodeState => (
                <Node 
                    key={nodeState.id}
                    nodeState={nodeState}
                    onSelect={handleNodeSelect}
                />
            ))}
        </div>
    );
};
