import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';
import { RegisterServiceDto, ClientSignatureBody, RegisterServiceBody } from './dto/register.dto';
import { ClientSign } from './network/client-sign';

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

        window.document.getElementById('addressID').value = hash;
    };

    /**
     * Gets message from IPFS
     * @param {string} hash - Hash of the message
     */
    async function getMessageFromIPFS(hash) {
        const response = await ServerAPI.getMessageFromIPFS(hash);
        const receivedMessage = await response.text;

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

        // CLIENT SIGN AT CLIENT SIDE
        const clientSign = new ClientSign();
        const clientSignature = await clientSign.createSignatureAddService(clientSigBody.network, clientSigBody.service);

        window.document.getElementById('clientSignatureID').value = clientSignature;
    };

    /**
     * Server register button click - handler function
     */
    async function serverRegisterButtonClickedHandler() {
        window.document.getElementById('serverSignatureID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBody();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterService(registerServiceBodyJSON);

        window.document.getElementById('serverSignatureID').value = registerHash;
    };

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBody() {
        const regService = new RegisterServiceDto('test', 'https://ipfs.io/ipfs/ID', getIpfsHash());
        console.log(regService);
        const clientSigBody = new ClientSignatureBody('goerli', regService);
        return clientSigBody;
    }

    /**
     * Creates hard coded register service body
     */
    function createHardCodedRegisterServiceBody() {
        const did = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const signature = window.document.getElementById('clientSignatureID').value;
        const service = new RegisterServiceDto('test', 'https://ipfs.io/ipfs/ID', getIpfsHash());
        const registerServiceBody = new RegisterServiceBody(did, signature, service);
        return registerServiceBody;
    }

    /**
     * Gets IPFS hash
     * @returns IPFS hash
     */
    function getIpfsHash() {
        let ipfsHash = window.document.getElementById('addressID').value;
        if (ipfsHash === '' || ipfsHash === null || ipfsHash === undefined) {
            ipfsHash = 'QmXYi5FvRE68KjhEWVaMjg3Mp1mF5ZRhk38TDoLdJKnzv7';
        }

        return ipfsHash;
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
