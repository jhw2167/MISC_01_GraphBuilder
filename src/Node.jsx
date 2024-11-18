import React from 'react';
import PropTypes from 'prop-types';
import { NodeState } from './NodeState';
import { NodeOptionsPanel } from './NodeOptionsPanel';
import { COLORS } from './NodeState';

export const Node = ({ nodeState, grid, isSelected }) => {

    const xPos = grid.BUFFER_SIDE + (parseInt(nodeState.posX) * grid.HORIZONTAL_SPACING);
    const yPos = grid.BUFFER_TOP + (parseInt(nodeState.posY) * grid.VERTICAL_SPACING);

    //if the id is dummy, calculate the position based on the mouse position
    const isDummy = nodeState.id === 'dummy';

    return (
        <div style={{ position: 'relative' }}>
            <div 
            data-node-id={nodeState.id}
            style={{
                position: 'absolute',
                width: `${grid.NODE_WIDTH}px`,
                height: `${grid.NODE_HEIGHT}px`,
                left: isDummy ? `${nodeState.posX}px` : `${xPos}px`,
                top: isDummy ? `${nodeState.posY}px` : `${yPos}px`,
                backgroundColor: nodeState.color,
                padding: '10px',
                borderRadius: '5px',
                borderStyle: 'solid',
                borderWidth: isSelected ? '4px' : '1px',
                borderColor: isSelected ? 'yellow' : 'black',
                cursor: 'pointer',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '1.2em' }}>{nodeState.icon}</div>
                <div style={{ fontWeight: 'bold' }}>{nodeState.title}</div>
                {nodeState.subtitle && <div style={{ fontSize: '0.9em', color: '#666' }}>{nodeState.subtitle}</div>}
                <div style={{ fontSize: '0.8em' }}>{nodeState.descr}</div>
            </div>
        </div>
        </div>
    );
  };

Node.propTypes = {
    nodeState: PropTypes.instanceOf(NodeState).isRequired,
    grid: PropTypes.shape({
        NODE_WIDTH: PropTypes.number.isRequired,
        NODE_HEIGHT: PropTypes.number.isRequired,
        VERTICAL_SPACING: PropTypes.number.isRequired,
        HORIZONTAL_SPACING: PropTypes.number.isRequired,
        BUFFER_TOP: PropTypes.number.isRequired,
        BUFFER_SIDE: PropTypes.number.isRequired
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onOptionChange: PropTypes.func
};
