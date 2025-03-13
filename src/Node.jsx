import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NodeState, NodeUnlocks } from './NodeState';
import { NodeOptionsPanel } from './NodeOptionsPanel';
import { COLORS } from './NodeState';

export const Node = ({ nodeState, grid, isSelected }) => {
    const [isHovered, setIsHovered] = useState(false);

    const xPos = grid.BUFFER_SIDE + (parseInt(nodeState.posX) * grid.HORIZONTAL_SPACING);
    const yPos = grid.BUFFER_TOP + (parseInt(nodeState.posY) * grid.VERTICAL_SPACING);

    //if the id is dummy, calculate the position based on the mouse position
    const isDummy = nodeState.id === 'dummy';

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div style={{ position: 'relative', pointerEvents: 'none' }}>
            <div
                data-node-id={nodeState.id}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    pointerEvents: 'auto',
                    position: 'absolute',
                    width: `${grid.NODE_WIDTH}px`,
                    height: `${grid.NODE_HEIGHT}px`,
                    left: isDummy ? `${nodeState.posX}px` : `${xPos}px`,
                    top: isDummy ? `${nodeState.posY}px` : `${yPos}px`,
                    backgroundColor: nodeState.color,
                    padding: '6px',
                    borderRadius: '5px',
                    borderStyle: 'solid',
                    borderWidth: isSelected ? '4px' : '1px',
                    borderColor: isSelected ? 'yellow' : 'black',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                    <div style={{ width: '32px', height: '32px', flexShrink: 0 }}>
                        <img
                            src={`/src/assets/img/${nodeState.icon}`}
                            alt=""
                            onError={(e) => e.target.style.display = 'none'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                    <div style={{
                        height: '32px',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                    }}>
                        {/* First Row */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',  // Ensures elements are in a row
                            width: '100%',
                            alignItems: 'center'  // Align text vertically
                        }}>
                            <div style={{
                                fontWeight: 'bold',
                                flex: 1 // Makes sure it takes up available space
                            }}>
                                {nodeState.title}
                            </div>
                        </div>
                           {/* Second Row (You can add more content here if needed) */}
                           <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '50%',
                            width: '100%',
                            alignItems: 'top', // Aligns items in row
                        }}>
                           {nodeState.subtitle && (
                                <div style={{
                                    fontSize: '0.9em',
                                    color: '#666',
                                    marginLeft: '8px',
                                    flex: 1, // Makes sure it takes up available space
                                }}>
                                    {nodeState.subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            {isHovered && !isSelected && nodeState.descr && (
                <div style={{
                    position: 'absolute',
                    left: `${xPos + grid.NODE_WIDTH + 10}px`,
                    top: `${yPos}px`,
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid black',
                    maxWidth: '200px',
                    zIndex: 1000,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                    {nodeState.descr}
                </div>
            )}
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
    onOptionChange: PropTypes.func,
    unlocks: PropTypes.arrayOf(PropTypes.instanceOf(NodeUnlocks))
};
