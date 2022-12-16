import React, { /* useState, */ useEffect } from 'react';
import '../styles/styleToggleButton.css';

// eslint-disable-next-line react/prop-types
export const ToggleButton = ({ setValue }) => {
    let value = 'private';

    useEffect(() => {

    });

    function checkboxClickedHandler() {
        if (value === 'private') {
            value = 'public';
        } else {
            value = 'private';
        }
        setValue(value);
    }

    return (
        <div className='toggleButtonMainContainer' >
            <label>Private</label>
            <label className="switch">
                <input type="checkbox" onClick={checkboxClickedHandler}></input>
                <span className="slider round"></span>
            </label>
            <label>Public</label>
        </div>
    );
};
