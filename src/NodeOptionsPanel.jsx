import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from './NodeState';
import { COLOR_OPTIONS, ICON_OPTIONS } from './NodeOptions';

export const NodeOptionsPanel = ({ options, onOptionChange, onDisconnectAll, onToggleConnectMode, style }) => {
    const handleCycleOption = (optionKey, currentValue, optionsList) => {
        const currentIndex = optionsList.findIndex(opt => opt.value === currentValue);
        const nextIndex = (currentIndex + 1) % optionsList.length;
        onOptionChange(optionKey, optionsList[nextIndex].value);
    };

    return (
        <div style={{
            position: 'absolute',
            transform: 'translateX(-50%)',
            ...style,
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '5px',
            padding: '5px',
            zIndex: 1000,
            display: 'flex',
            gap: '5px'
        }}>
            <button 
                onClick={() => handleCycleOption('color', options.color, COLOR_OPTIONS)}
                style={{
                    backgroundColor: COLORS[options.color],
                    border: '1px solid black',
                    borderRadius: '3px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                }}
            >
                {COLOR_OPTIONS.find(opt => opt.value === options.color)?.label}
            </button>
            <button 
                onClick={() => handleCycleOption('icon', options.icon, ICON_OPTIONS)}
                style={{
                    border: '1px solid black',
                    borderRadius: '3px',
                    padding: '5px 10px',
                    cursor: 'pointer'
                }}
            >
                {options.icon}
            </button>
            <button 
                onClick={onDisconnectAll}
                style={{
                    backgroundColor: '#ffcccc',
                    border: '1px solid red',
                    borderRadius: '3px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    color: 'red',
                    fontWeight: 'bold'
                }}
            >
                ❌
            </button>
            <button 
                onClick={onToggleConnectMode}
                style={{
                    backgroundColor: '#ccffcc',
                    border: '1px solid green',
                    borderRadius: '3px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    color: 'green',
                    fontWeight: 'bold'
                }}
            >
                ✓
            </button>
        </div>
    );
};

NodeOptionsPanel.propTypes = {
    options: PropTypes.shape({
        color: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
    }).isRequired,
    onOptionChange: PropTypes.func.isRequired,
    onDisconnectAll: PropTypes.func.isRequired,
    onToggleConnectMode: PropTypes.func.isRequired,
    style: PropTypes.object
};
