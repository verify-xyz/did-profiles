import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';
import { RegisterServiceDto, ClientSignatureBody, RegisterServiceBody } from './dto/register.dto';
// import { ClientSign } from './network/client-sign';

function App() {
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
    async function sendMessageToIPFS(message) {
        const response = await ServerAPI.sendMessageToIPFS(message);
        const hash = response.hash;

        // Update address field with received HASH from the server
        window.document.getElementById('addressID').value = hash;
    };

    /**
     * Gets message from IPFS
     * @param {string} hash - Hash of the message
     */
    async function getMessageFromIPFS(hash) {
        const response = await ServerAPI.getMessageFromIPFS(hash);
        const receivedMessage = await response.text;

        // Update received message field with received MESSAGE from the server
        window.document.getElementById('receivedMessageID').value = receivedMessage;
    };

    /**
     * Send button clicked - handler function
     */
    function sendButtonClickedHandler() {
        const inputMessage = window.document.getElementById('messageID').value;
        sendMessageToIPFS(inputMessage);
        setMessage(inputMessage);
    };

    /**
     * Fetch button click - handler function
     */
    function fetchButtonClickedHandler() {
        const inputAddress = window.document.getElementById('addressID').value;
        getMessageFromIPFS(inputAddress);
        setAddress(inputAddress);
    };

    /**
     * Client signature button click - handler function
     */
    async function clientSignatureButtonClickedHandler() {
        window.document.getElementById('clientSignatureID').value = '';
        window.document.getElementById('serverSignatureID').value = '';

        const clientSigBody = createHardCodedClientSignatureBody();
        const clientSigBodyJSON = JSON.stringify(clientSigBody);
        const clientSignature = await ServerAPI.postClientSignature(clientSigBodyJSON);

        window.document.getElementById('clientSignatureID').value = clientSignature;

        console.log('client signature received from backend: ');
        console.log(clientSignature);
    };

    /**
     * Server register button click - handler function
     */
    async function serverRegisterButtonClickedHandler() {
        const clientSignature = window.document.getElementById('clientSignatureID').value;
        console.log(clientSignature);
        const registerServiceBody = createHardCodedRegisterServiceBody();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterService(registerServiceBodyJSON);
        window.document.getElementById('serverSignatureID').value = registerHash;

        console.log('register hash received from backend: ');
        console.log(registerHash);
    };

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBody() {
        const regService = new RegisterServiceDto('test', 'https://ipfs.io/ipfs/ID');
        const clientSigBody = new ClientSignatureBody('goerli', regService);
        return clientSigBody;
    }

    /**
     * Creates hard coded register service body
     */
    function createHardCodedRegisterServiceBody() {
        const did = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const signature = window.document.getElementById('clientSignatureID').value;
        const service = new RegisterServiceDto('test', 'https://ipfs.io/ipfs/ID');
        const registerServiceBody = new RegisterServiceBody(did, signature, service);
        return registerServiceBody;
    }

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

            <div className="appGridContainer03">
                <label className="appLabelAddress">Client:</label>
                <input className="appInputAddress" id="clientSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={clientSignatureButtonClickedHandler}>Client Signature</button>
                {/* <button className="appButtonFetch" onClick={async() => { await clientSignatureButtonClickedHandler(); } }>Client Signature</button> */}

                <label className="appLabel">Server:</label>
                <input className="appInput" id="serverSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={serverRegisterButtonClickedHandler}>Register</button>
            </div>
        </div>
    );
}

export default App;
