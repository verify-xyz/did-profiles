import React, { useState, useEffect } from 'react';
import './styles/styleApp.css';
import ServerAPI from './api/serverAPI.js';
import { RegisterServiceDto, ClientSignatureBody, RegisterServiceBody, RegisterServiceBodyWithAccess } from './dto/register.dto';
import { ClientSign } from './network/client-sign';
import { ToggleButton } from './components/toggleButton';

function App() {
    const [message, setMessage] = useState('');
    const [address, setAddress] = useState('');
    const [txRecord, setTxRecord] = useState('');
    const [access, setAccess] = useState(false);

    useEffect(() => {
        console.log(message);
        console.log(address);
        console.log('access: ' + access);
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
        window.document.getElementById('serviceEndpointID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBody();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterService(registerServiceBodyJSON);

        window.document.getElementById('serverSignatureID').value = registerHash.meta;
        window.document.getElementById('serviceEndpointID').value = registerHash.serviceEndpoint;

        setTxRecord('https://goerli.etherscan.io/tx/' + registerHash.meta);

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

        // window.document.getElementById('timerID').textContent = '0';
        window.document.getElementById('resolveID').value = '';
        // window.document.getElementById('serviceEndpointID').value = '';

        const url = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const response = await ServerAPI.getResolve(url);
        console.log(response);

        let verificationMethod = 'Request failed. Please try again.';
        // let serviceEndpoint = '';

        if (response?.didDocument?.verificationMethod[0]?.id) {
            verificationMethod = await response.didDocument.verificationMethod[0].id;
        }

        /* if (response?.didDocument?.service[0]?.serviceEndpoint) {
            serviceEndpoint = await response.didDocument.service[0].serviceEndpoint;
        } */

        window.document.getElementById('resolveID').value = verificationMethod;
        // window.document.getElementById('serviceEndpointID').value = serviceEndpoint;

        btn.removeAttribute('disabled');
        clearInterval(interval);
    };

    /**
     * Sends register service endpoint ipfs hash to server and gets decryptrd content
     */
    async function fetch4ButtonClickedHandler() {
        window.document.getElementById('decryptedContentID').value = '';
        const btn = window.document.getElementById('step4BtnFetch');
        btn.setAttribute('disabled', 'disabled');

        const serviceEndpoint = window.document.getElementById('serviceEndpointID').value;
        console.log(serviceEndpoint);
        const urlParameter = getUrlParameter(serviceEndpoint);
        const message = await ServerAPI.getMessageFromIPFS(urlParameter);

        window.document.getElementById('decryptedContentID').value = message.text;

        btn.removeAttribute('disabled');
    }

    /**
     * Extracts url parameter from url
     * @param {url} url - url
     * @returns url parameter
     */
    function getUrlParameter(url) {
        while (url.includes('/')) {
            url = url.substring(url.indexOf('/') + 1);
        }

        return url;
    }

    /**
     * Gets client signature
     */
    async function clientSignatureStep5ButtonClickedHandler() {
        const clientSigBody = createHardCodedClientSignatureBody();

        // Clear subsequent fields
        window.document.getElementById('clientSignatureStep5ID').value = '';
        window.document.getElementById('writeStep5ID').value = '';

        const clientSign = new ClientSign();
        const clientSignature = await clientSign.createSignatureAddService(clientSigBody.network, clientSigBody.service);

        window.document.getElementById('clientSignatureStep5ID').value = clientSignature;
    }

    /**
     * Write to server (private/public)
     */
    async function writeStep5ButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step5BtnWrite');
        btn.setAttribute('disabled', 'disabled');

        // Clear field
        window.document.getElementById('writeStep5ID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBodyStep5();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterServiceWithAccess(registerServiceBodyJSON);

        window.document.getElementById('writeStep5ID').value = registerHash.serviceEndpoint;

        btn.removeAttribute('disabled');
    }

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBody() {
        const cid = getIpfsHash();
        const regService = new RegisterServiceDto('verify_xyz_profiles', process.env.REACT_APP_IPFS_URL2 + cid, cid);
        const clientSigBody = new ClientSignatureBody('goerli', regService);
        return clientSigBody;
    }

    /**
     * Creates hard coded register service body
     */
    function createHardCodedRegisterServiceBody() {
        const did = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const signature = window.document.getElementById('clientSignatureID').value;
        const cid = getIpfsHash();
        const service = new RegisterServiceDto('verify_xyz_profiles', process.env.REACT_APP_IPFS_URL2 + cid, cid);
        const registerServiceBody = new RegisterServiceBody(did, signature, service);
        return registerServiceBody;
    }

    /**
     * Creates hard coded register service body for step 5
     */
    function createHardCodedRegisterServiceBodyStep5() {
        const did = 'did:ethr:goerli:0x5Cd0a02E159896845658796c350162aFE8bEA01d';
        const signature = window.document.getElementById('clientSignatureStep5ID').value;
        const cid = getIpfsHash();
        const service = new RegisterServiceDto('verify_xyz_profiles', process.env.REACT_APP_IPFS_URL2 + cid, cid);
        const accessValue = access ? 'public' : 'private';
        console.log('accessValue: ' + accessValue);

        const registerServiceBodyWithAccess = new RegisterServiceBodyWithAccess(did, signature, service, accessValue);
        return registerServiceBodyWithAccess;
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

    /**
     * Passes data from ToggleButton to parent
     * @param {string} childData - private/public
     */
    function changeAccessPrivatePublic() {
        setAccess(!access);
    };

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
                <button className="appButtonFetch" onClick={fetch4ButtonClickedHandler} id="step4BtnFetch">Fetch</button>

                <label className="appLabel">Decrypted content:</label>
                <input className="appInput" id="decryptedContentID" readOnly></input>
                <div></div>
            </div>

            <div className="appGridContainer appGridContainer05">
                <label className="stepLabel">Step #5</label>
                <div>Private/Public Transaction</div>
                <div></div>

                <ToggleButton onToggle={changeAccessPrivatePublic} isToggled={access}></ToggleButton><div></div><div></div>

                <label className="appLabel">Client:</label>
                <input className="appInput" id="clientSignatureStep5ID" readOnly></input>
                <button className="appButtonFetch" onClick={clientSignatureStep5ButtonClickedHandler} id="step5BtnClientSig">Client Signature</button>

                <label className="appLabel">Write:</label>
                <input className="appInput" id="writeStep5ID" readOnly></input>
                <button className="appButtonFetch" onClick={writeStep5ButtonClickedHandler} id="step5BtnWrite">Write</button>
            </div>
        </div>
    );
}

export default App;
