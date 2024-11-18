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
      onClick={onClick}
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
