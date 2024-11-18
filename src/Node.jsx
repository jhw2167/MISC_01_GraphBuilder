import React from 'react';
import PropTypes from 'prop-types';
import { NodeState } from './NodeState';

export const Node = ({ nodeState, onSelect, grid }) => {

    const xPos = grid.BUFFER_SIDE + (parseInt(nodeState.posX) * grid.HORIZONTAL_SPACING);
    const yPos = grid.BUFFER_TOP + (parseInt(nodeState.posY) * grid.VERTICAL_SPACING);

    return (
        <div 
            data-node-id={nodeState.id}
            style={{
                position: 'absolute',
                width: `${grid.NODE_WIDTH}px`,
                height: `${grid.NODE_HEIGHT}px`,
                left: `${xPos}px`,
                top: `${yPos}px`,
                backgroundColor: nodeState.color,
                padding: '10px',
                borderRadius: '5px',
                cursor: 'pointer',
                boxSizing: 'border-box'
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
    onSelect: PropTypes.func.isRequired,
    grid: PropTypes.shape({
        NODE_WIDTH: PropTypes.number.isRequired,
        NODE_HEIGHT: PropTypes.number.isRequired,
        VERTICAL_SPACING: PropTypes.number.isRequired,
        HORIZONTAL_SPACING: PropTypes.number.isRequired,
        BUFFER_TOP: PropTypes.number.isRequired,
        BUFFER_SIDE: PropTypes.number.isRequired
    }).isRequired
};
