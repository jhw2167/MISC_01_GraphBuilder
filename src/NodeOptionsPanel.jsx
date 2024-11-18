import React from 'react';
import PropTypes from 'prop-types';
import { COLOR_OPTIONS, ICON_OPTIONS } from './NodeOptions';

export const NodeOptionsPanel = ({ options, onOptionChange }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '5px',
            padding: '5px',
            zIndex: 1000,
            display: 'flex',
            gap: '5px'
        }}>
            <select 
                value={options.color} 
                onChange={(e) => onOptionChange('color', e.target.value)}
            >
                {COLOR_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <select 
                value={options.icon} 
                onChange={(e) => onOptionChange('icon', e.target.value)}
            >
                {ICON_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label} {option.value}
                    </option>
                ))}
            </select>
        </div>
    );
};

NodeOptionsPanel.propTypes = {
    options: PropTypes.shape({
        color: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
    }).isRequired,
    onOptionChange: PropTypes.func.isRequired
};
