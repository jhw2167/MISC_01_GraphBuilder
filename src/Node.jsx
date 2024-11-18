import React from 'react';
import PropTypes from 'prop-types';
import { NodeState } from './NodeState';

export const Node = ({ nodeState, grid, isSelected }) => {

    const xPos = grid.BUFFER_SIDE + (parseInt(nodeState.posX) * grid.HORIZONTAL_SPACING);
    const yPos = grid.BUFFER_TOP + (parseInt(nodeState.posY) * grid.VERTICAL_SPACING);

    //if the id is dummy, calculate the position based on the mouse position
    const isDummy = nodeState.id === 'dummy';

    return (
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
            <div style={{ position: 'relative' }}>
                <div>{nodeState.icon}</div>
                <div>{nodeState.title}</div>
                {nodeState.subtitle && <div>{nodeState.subtitle}</div>}
                <div>{nodeState.descr}</div>
                {isSelected && (
                    <div 
                        data-delete-button
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'red',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    />
                )}
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
    isSelected: PropTypes.bool.isRequired
};
