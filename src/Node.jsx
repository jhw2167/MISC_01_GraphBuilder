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
            style={{ ...buttonStyle, top: '-30px', left: '50%', transform: 'translateX(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onDisconnect();
            }}
          >
            X
          </button>
          <button 
            style={{ ...buttonStyle, top: '50%', left: '-60px', transform: 'translateY(-50%)' }}
            onClick={(e) => {
              e.stopPropagation();
              onUndo();
            }}
          >
            ↩
          </button>
          <button 
            style={{ ...buttonStyle, top: '50%', right: '-60px', transform: 'translateY(-50%)' }}
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
