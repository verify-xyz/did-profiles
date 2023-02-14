import React from 'react';
import '../styles/styleToggleButton.css';

// eslint-disable-next-line react/prop-types
export const ToggleButton = ({ onToggle, isToggled }: {onToggle: any, isToggled: boolean}) => {
    return (
        <div className='toggleButtonMainContainer' >
            <label>Private</label>
            <label className="switch">
                <input type="checkbox" onChange={onToggle} checked={isToggled} data-testid='toggle-button-checkbox'></input>
                <span className="slider round"></span>
            </label>
            <label>Public</label>
        </div>
    );
};
