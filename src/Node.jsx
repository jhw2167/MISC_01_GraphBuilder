import React from 'react';
import PropTypes from 'prop-types';
import { NodeState } from './NodeState';

export const Node = ({ nodeState, onSelect }) => {
    const handleClick = () => {
        if (onSelect) {
            onSelect(nodeState.id);
        }
    };

    return (
        <div 
            onClick={handleClick}
            style={{
                position: 'relative',
                 width: '150px',
                 height: '100px',
                left: `${nodeState.posX}px`,
                top: `${nodeState.posY}px`,
                
                backgroundColor: nodeState.color,
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer'
            }}
        >
            <div>{nodeState.icon}</div>
            <div>{nodeState.title}</div>
            {nodeState.subtitle && <div>{nodeState.subtitle}</div>}
            <div>{nodeState.descr}</div>
        </div>
    );
};

Node.propTypes = {
    nodeState: PropTypes.instanceOf(NodeState).isRequired,
    onSelect: PropTypes.func.isRequired
};
