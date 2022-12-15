import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';
import { RegisterServiceDto, ClientSignatureBody, RegisterServiceBody } from './dto/register.dto';
import { ClientSign } from './network/client-sign';

function App() {
    const [message, setMessage] = useState('');
    const [address, setAddress] = useState('');
    const [txRecord, setTxRecord] = useState('');

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
    async function sendButtonClickedHandler() {
        const inputMessage = window.document.getElementById('messageID').value;
        setMessage(inputMessage);

        // Disable button until after response
        const btn = window.document.getElementById('step1Btn');
        btn.setAttribute('disabled', 'disabled');

        // Clear subsequent fields
        window.document.getElementById('clientSignatureID').value = '';
        window.document.getElementById('serverSignatureID').value = '';
        window.document.getElementById('receivedMessageID').value = '';
        window.document.getElementById('addressID').value = '';

        await sendMessageToIPFS(inputMessage);

        btn.removeAttribute('disabled');
    };

    /**
     * Fetch button click - handler function
     */
    async function fetchButtonClickedHandler() {
        const inputAddress = window.document.getElementById('addressID').value;
        setAddress(inputAddress);

        // Disable button until after response
        const btn = window.document.getElementById('step2Btn');
        btn.setAttribute('disabled', 'disabled');

        // Clear subsequent fields
        window.document.getElementById('clientSignatureID').value = '';
        window.document.getElementById('serverSignatureID').value = '';
        window.document.getElementById('receivedMessageID').value = '';

        await getMessageFromIPFS(inputAddress);

        btn.removeAttribute('disabled');
    };

    /**
     * Client signature button click - handler function
     */
    async function clientSignatureButtonClickedHandler() {
        const clientSigBody = createHardCodedClientSignatureBody();

        // Clear subsequent fields
        window.document.getElementById('clientSignatureID').value = '';
        window.document.getElementById('serverSignatureID').value = '';

        // CLIENT SIGN AT CLIENT SIDE
        const clientSign = new ClientSign();
        const clientSignature = await clientSign.createSignatureAddService(clientSigBody.network, clientSigBody.service);

        window.document.getElementById('clientSignatureID').value = clientSignature;
    };

    /**
     * Server register button click - handler function
     */
    async function serverRegisterButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step3Btn');
        btn.setAttribute('disabled', 'disabled');

        // Clear subsequent fields
        window.document.getElementById('serverSignatureID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBody();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterService(registerServiceBodyJSON);

        window.document.getElementById('serverSignatureID').value = registerHash;

        setTxRecord('https://goerli.etherscan.io/tx/' + registerHash);

        btn.removeAttribute('disabled');
    };

    /**
     * Resolve button click - handler function
     */
    async function resolveButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step4Btn');
        btn.setAttribute('disabled', 'disabled');
        const interval = setInterval(timer, 1000);

        window.document.getElementById('timerID').textContent = '0';
        window.document.getElementById('resolveID').value = '';
        window.document.getElementById('serviceEndpointID').value = '';

        const url = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const response = await ServerAPI.getResolve(url);
        console.log(response);

        let verificationMethod = 'Request failed. Please try again.';
        let serviceEndpoint = '';

        if (response?.didDocument?.verificationMethod[0]?.id) {
            verificationMethod = await response.didDocument.verificationMethod[0].id;
        }

        if (response?.didDocument?.service[0]?.serviceEndpoint) {
            serviceEndpoint = await response.didDocument.service[0].serviceEndpoint;
        }

        window.document.getElementById('resolveID').value = verificationMethod;
        window.document.getElementById('serviceEndpointID').value = serviceEndpoint;

        btn.removeAttribute('disabled');
        clearInterval(interval);
    };

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBody() {
        const regService = new RegisterServiceDto('test', 'https://ipfs.io/ipfs/ID', getIpfsHash());
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

    function timer() {
        let value = parseInt(document.getElementById('timerID').textContent.match(/\d+$/)[0], 10);
        value = isNaN(value) ? 0 : value;
        value++;
        document.getElementById('timerID').textContent = value;
        console.log(value);
    }

    return (
        <div className="appMainContainer">
            <h1 className="appHeader">DID Profiles Testing App</h1>

            <div className="appGridContainer appGridContainer01">
                <label className="stepLabel">Step #1 </label><div>Send a message, encrypt and post to IPFS</div><div></div>

                <label className="appLabel">Message:</label>
                <input className="appInput" id='messageID'></input>
                <button className="appButtonSend" id="step1Btn" onClick={sendButtonClickedHandler}>Send</button>
            </div>

            <div className="appGridContainer appGridContainer02">
                <label className="stepLabel">Step #2</label><div>Fetch IPFS content by hash and decrypt</div><div></div>

                <label className="appLabelAddress">IPFS Hash:</label>
                <input className="appInputAddress" id="addressID" readOnly></input>
                <button className="appButtonFetch" id="step2Btn" onClick={fetchButtonClickedHandler}>Fetch</button>

                <label className="appLabel">Message:</label>
                <input className="appInput" id="receivedMessageID" readOnly></input>
            </div>

            <div className="appGridContainer appGridContainer03">
                <label className="stepLabel">Step #3</label><div>Sign transaction with client key and register the content in smart-contract</div><div></div>

                <label className="appLabelAddress">Client:</label>
                <input className="appInputAddress" id="clientSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={clientSignatureButtonClickedHandler}>Client Signature</button>
                {/* <button className="appButtonFetch" onClick={async() => { await clientSignatureButtonClickedHandler(); } }>Client Signature</button> */}

                <label className="appLabel">Server:</label>
                <input className="appInput" id="serverSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={serverRegisterButtonClickedHandler} id="step3Btn">Register</button>

                {(txRecord && <a href={txRecord} target="_blank" rel="noreferrer">{txRecord}</a>)}
            </div>

            <div className="appGridContainer appGridContainer04">
                <label className="stepLabel">Step #4</label>
                <div>Resolve</div>
                <div></div>

                <label className="appLabel">Authentication:</label>
                <input className="appInput" id="resolveID" readOnly></input>
                <button className="appButtonFetch" onClick={resolveButtonClickedHandler} id="step4Btn">Resolve</button>

                <label className="appLabel">Service endpoint:</label>
                <input className="appInput" id="serviceEndpointID" readOnly></input>
                <label className="appLabel" id="timerID">0</label>
            </div>
        </div>
    );
}

export default App;
