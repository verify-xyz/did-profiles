import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';

function App () {
    const [message, setMessage] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        console.log(message);
        console.log(address);
    });

    /**
     * Sends message to IPFS
     * @param {string} message - Message that should be added to IPFS
     */
    async function sendMessageToIPFS (message) {
        const response = await ServerAPI.sendMessageToIPFS(message);
        const hash = response.hash;

        // Update address field with received HASH from the server
        window.document.getElementById('addressID').value = hash;
    };

    /**
     * Gets message from IPFS
     * @param {string} hash - Hash of the message
     */
    async function getMessageFromIPFS (hash) {
        const response = await ServerAPI.getMessageFromIPFS(hash);
        const receivedMessage = await response.message;

        // Update received message field with received MESSAGE from the server
        window.document.getElementById('receivedMessageID').value = receivedMessage;
    };

    /**
     * Send button clicked - handler function
     */
    function sendButtonClickedHandler () {
        const inputMessage = window.document.getElementById('messageID').value;
        sendMessageToIPFS(inputMessage);
        setMessage(inputMessage);
    };

    /**
     * Fetch button click - handler function
     */
    function fetchButtonClickedHandler () {
        const inputAddress = window.document.getElementById('addressID').value;
        getMessageFromIPFS(inputAddress);
        setAddress(inputAddress);
    };

    return (
        <div className="appMainContainer">
            <h1 className="appHeader">Simple React App</h1>

            <div className="appGridContainer01">
                <label className="appLabel">Message:</label>
                <input className="appInput" id='messageID'></input>
                <button className="appButtonSend" onClick={sendButtonClickedHandler}>Send</button>
            </div>

            <div className="appGridContainer02">
                <label className="appLabelAddress">Address:</label>
                <input className="appInputAddress" id="addressID" readOnly></input>
                <button className="appButtonFetch" onClick={fetchButtonClickedHandler}>Fetch</button>

                <label className="appLabel">Message:</label>
                <input className="appInput" id="receivedMessageID" readOnly></input>
            </div>
        </div>
    );
}

export default App;
