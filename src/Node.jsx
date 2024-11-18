import React from 'react';

const Node = ({ 
  node, 
  position, 
  isSelected, 
  onDisconnect, 
  onUndo, 
  onColorChange, 
  onClick 
}) => {
  const buttonStyle = {
    position: 'absolute',
    padding: '4px 8px',
    backgroundColor: 'white',
    border: '1px solid #475569',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  };

  const TOP_OFFSET = -12;
  const LEFT_OFFSET = [30, 70, 105];

  return (
    <div 
      style={{
        position: 'relative',
        width: '150px',
        height: '100px'
      }}
      onMouseDown={onClick}
    >
      {isSelected && (
        <>
          <button 
            style={{ ...buttonStyle, top: TOP_OFFSET, left: LEFT_OFFSET[0] }}
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect();
            }}
          >
            X
          </button>
          <button 
            style={{ ...buttonStyle, top: TOP_OFFSET, left: LEFT_OFFSET[1], transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
          >
            ↩
          </button>
          <button 
            style={{ ...buttonStyle, top: TOP_OFFSET, left: LEFT_OFFSET[2], transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onColorChange();
            }}
          >
            🎨
          </button>
        </>
      )}
    </div>
  );
};

export default Node;
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
                position: 'absolute',
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
