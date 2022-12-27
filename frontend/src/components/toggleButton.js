import React, { useState /* useEffect */ } from 'react';
import '../styles/styleToggleButton.css';

// eslint-disable-next-line react/prop-types
export const ToggleButton = ({ setValue }) => {
    const [isToggled, setIsToggled] = useState(false);
    const onToggle = () => {
        setIsToggled(!isToggled);
        setValue(!isToggled);
    };

    /* let value = 'private';

    useEffect(() => {

    });

    function checkboxClickedHandler() {
        if (value === 'private') {
            value = 'public';
        } else {
            value = 'private';
        }
        setValue(value);
    } */

    return (
        <div className='toggleButtonMainContainer' >
            <label>Private</label>
            <label className="switch">
                <input type="checkbox" onChange={onToggle} checked={isToggled}></input>
                <span className="slider round"></span>
            </label>
            <label>Public</label>
        </div>
    );
};
