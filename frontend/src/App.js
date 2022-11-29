import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';
import { create } from 'ipfs-http-client';
// import { Buffer } from 'buffer';

function App () {
    const [message, setMessage] = useState('Hello World!');
    const [address, setAddress] = useState('address');
    // const [receivedMessage, setReceivedMessage] = useState('');

    /* const projectId = 'projectid';
    const projectSecret = 'project-secret';
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64'); */

    /* Create an instance of the ipfs client */
    // const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });
    const client = create('https://ipfs.infura.io:5001/api/v0');

    useEffect(() => {
        console.log(message);
        console.log(address);
    });

    async function sendMessageToIPFS (message) {
        const obj = { message };
        const json = JSON.stringify(obj);

        ServerAPI.postSendMessageToIPFS(json);

        // Send message to IPFS
        /* console.log('send to IPFS');
        const added = await ipfs.add('hello world from react app');
        console.log(added); */

        const added = await client.add('hello world from react app');
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        console.log(url);
    };

    function getMessageFromIPFS (address) {
        const obj = { address };
        const json = JSON.stringify(obj);

        ServerAPI.postGetMessageFromIPFS(json);
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
        getMessageFromIPFS(inputAddress);
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
