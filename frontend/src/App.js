import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';

function App () {
    const [message, setMessage] = useState('Hello World!');
    const [address, setAddress] = useState('address');

    useEffect(() => {
        console.log(message);
        console.log(address);
    });

    function sendMessageToIPFS (message) {
        const obj = { message };
        const json = JSON.stringify(obj);

        ServerAPI.postSendMessageToIpfsServer(json);
    };

    function getHelloFromServer () {
        ServerAPI.getHello()
            .then(result => {
                console.log('Displaying result.message');
                console.log(result.message);
            });
    }

    function sendButtonClickedHandler () {
        const inputMessage = window.document.getElementById('messageID').value;
        sendMessageToIPFS(inputMessage);
        setMessage(inputMessage);
    };

    function fetchButtonClickedHandler () {
        const inputAddress = window.document.getElementById('addressID').value;
        getHelloFromServer();
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
                <input className="appInputAddress" id="addressID"></input>
                <button className="appButtonFetch" onClick={fetchButtonClickedHandler}>Fetch</button>

                <label className="appLabel">Message:</label>
                <input className="appInput"></input>
            </div>
        </div>
    );
}

export default App;
