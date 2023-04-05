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
        console.log('REACT_APP_INFURA_NETWORK_ID: ' + process.env.REACT_APP_INFURA_NETWORK_ID);

        window.document.getElementById('resolveID').value = 'did:ethr:goerli:' + process.env.REACT_APP_CLIENT_ADDRESS;
    });

    /**
     * Sends message to IPFS
     * @param {string} message - Message that should be added to IPFS
     */
    async function sendMessageToIPFS(message) {
        const response = await ServerAPI.sendMessageToIPFS(message);

        window.document.getElementById('addressID').value = response.hash;
        window.document.getElementById('step1Results').value = response.encryptedString;
    };

    /**
     * Gets message from IPFS
     * @param {string} hash - Hash of the message
     */
    async function getMessageFromIPFS(hash) {
        const text = await ServerAPI.getMessageFromIPFS(hash);

        window.document.getElementById('receivedMessageID').value = text;
    };

    /**
     * Send button clicked - handler function
     */
    async function step1SendButtonClickedHandler() {
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
        window.document.getElementById('step1Results').value = '';

        await sendMessageToIPFS(inputMessage);

        btn.removeAttribute('disabled');
    };

    /**
     * Fetch button click - handler function
     */
    async function step2FetchButtonClickedHandler() {
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
    async function step3ClientSignatureButtonClickedHandler() {
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
    async function step3ServerRegisterButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step3Btn');
        btn.setAttribute('disabled', 'disabled');

        // Clear subsequent fields
        window.document.getElementById('serverSignatureID').value = '';
        // window.document.getElementById('serviceEndpointID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBody();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterService(registerServiceBodyJSON);

        window.document.getElementById('serverSignatureID').value = registerHash.meta;
        // window.document.getElementById('serviceEndpointID').value = registerHash.serviceEndpoint;

        setTxRecord('https://goerli.etherscan.io/tx/' + registerHash.meta);

        btn.removeAttribute('disabled');
    };

    /**
     * Resolve button click - handler function
     */
    async function step4ResolveButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step4Btn');
        btn.setAttribute('disabled', 'disabled');

        window.document.getElementById('decryptedContentID').value = '';
        window.document.getElementById('serviceEndpointID').value = '';

        const url = `did:ethr:goerli:${process.env.REACT_APP_CLIENT_ADDRESS}`;
        const response = await ServerAPI.getResolve(url);
        console.log(response);

        let serviceEndpoint = 'Request failed. Please try again.';

        if (response?.didDocument?.service) {
            serviceEndpoint = response.didDocument.service[0].serviceEndpoint;
            if (serviceEndpoint.indexOf('undefined') === 0) {
                serviceEndpoint = serviceEndpoint.substring(9);
            } else {
                const start = serviceEndpoint.lastIndexOf('/');
                serviceEndpoint = serviceEndpoint.substring(start + 1);
            }
        }

        // window.document.getElementById('resolveID').value = verificationMethod;
        window.document.getElementById('serviceEndpointID').value = serviceEndpoint;

        btn.removeAttribute('disabled');
    };

    /**
     * Sends register service endpoint ipfs hash to server and gets decrypted content
     */
    async function step4FetchButtonClickedHandler() {
        window.document.getElementById('decryptedContentID').value = '';
        const btn = window.document.getElementById('step4BtnFetch');
        btn.setAttribute('disabled', 'disabled');

        const serviceEndpoint = window.document.getElementById('serviceEndpointID').value;
        console.log(serviceEndpoint);
        const urlParameter = getUrlParameter(serviceEndpoint);
        const message = await ServerAPI.getMessageFromIPFS(urlParameter);

        window.document.getElementById('decryptedContentID').value = message;

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
    async function step5ClientSignatureButtonClickedHandler() {
        const clientSigBody = createHardCodedClientSignatureBodyStep5();

        // Clear subsequent fields
        window.document.getElementById('clientSignatureStep5ID').value = '';
        window.document.getElementById('writeStep5ID').value = '';

        let newOwner = process.env.REACT_APP_CLIENT_ADDRESS;
        if (access === false) {
            newOwner = process.env.REACT_APP_SERVER_ADDRESS;
        }

        const clientSign = new ClientSign();
        const clientSignature = await clientSign.createSignatureChangeOwner(clientSigBody.network, newOwner);

        window.document.getElementById('clientSignatureStep5ID').value = clientSignature;
    }

    /**
     * Write to server (private/public)
     */
    async function step5WriteButtonClickedHandler() {
        // Disable button until after response
        const btn = window.document.getElementById('step5BtnWrite');
        btn.setAttribute('disabled', 'disabled');

        // Clear field
        window.document.getElementById('writeStep5ID').value = '';

        const registerServiceBody = createHardCodedRegisterServiceBodyStep5();
        const registerServiceBodyJSON = JSON.stringify(registerServiceBody);
        const registerHash = await ServerAPI.postRegisterServiceWithAccess(registerServiceBodyJSON);

        window.document.getElementById('writeStep5ID').value = registerHash;

        btn.removeAttribute('disabled');
    }

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBody() {
        const cid = getIpfsHash();
        const regService = new RegisterServiceDto('verify_xyz_profiles', cid, cid);
        const clientSigBody = new ClientSignatureBody('goerli', regService);
        return clientSigBody;
    }

    /**
     * Creates hard coded client signature body
     * @returns client signature
     */
    function createHardCodedClientSignatureBodyStep5() {
        const cid = getIpfsHash();
        const regService = new RegisterServiceDto('verify_xyz_profiles', cid, cid);
        const clientSigBody = new ClientSignatureBody('goerli', regService);
        return clientSigBody;
    }

    /**
     * Creates hard coded register service body
     */
    function createHardCodedRegisterServiceBody() {
        const did = `did:ethr:goerli:${process.env.REACT_APP_CLIENT_ADDRESS}`;
        const signature = window.document.getElementById('clientSignatureID').value;
        const cid = getIpfsHash();
        const service = new RegisterServiceDto('verify_xyz_profiles', cid, cid);
        const registerServiceBody = new RegisterServiceBody(did, signature, service);
        return registerServiceBody;
    }

    /**
     * Creates hard coded register service body for step 5
     */
    function createHardCodedRegisterServiceBodyStep5() {
        const did = `did:ethr:goerli:${process.env.REACT_APP_CLIENT_ADDRESS}`;
        const signature = window.document.getElementById('clientSignatureStep5ID').value;
        const cid = getIpfsHash();
        const service = new RegisterServiceDto('verify_xyz_profiles', cid, cid);
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
            <h1 className="appHeader">DID Profiles Walkthrough</h1>

            <div className="appGridContainer appGridContainer01" >
                <label className="stepLabel">Step #1 </label><div>Send a message, encrypt and post to IPFS</div><div></div>
                <label className="appLabel">Message:</label><input className="appInput" id='messageID'></input><button className="appButtonSend" id="step1Btn" onClick={step1SendButtonClickedHandler}>Send</button>
                <label className="appLabel" style={{ gridColumn: 'span 2', display: `${message ? 'block' : 'none'}` }}>Encrypted messaged pushed to IPFS:</label><div></div>
                <textarea readOnly rows="4" style={{ gridColumn: 'span 3', height: '140px' }} id='step1Results'></textarea>
                <div> </div>
            </div>

            <div className="appGridContainer appGridContainer02">
                <label className="stepLabel">Step #2</label><div>Fetch IPFS content by hash and decrypts.</div><div></div>

                <label className="appLabelAddress">IPFS Hash:</label>
                <input className="appInputAddress" id="addressID" readOnly></input>
                <button className="appButtonFetch" id="step2Btn" onClick={step2FetchButtonClickedHandler}>Fetch</button>

                <label className="appLabel">Decrypted Message:</label>
                <input className="appInput" id="receivedMessageID" readOnly></input>
            </div>

            <div className="appGridContainer appGridContainer03">
                <label className="stepLabel">Step #3</label><div>Sign meta-transaction with client&lsquo;s DID key and register the IPFS hash to the &quot;eth-did-registry&quot; smart-contract</div><div></div>

                <label className="appLabelAddress">Client:</label>
                <input className="appInputAddress" id="clientSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={step3ClientSignatureButtonClickedHandler}>Sign</button>
                {/* <button className="appButtonFetch" onClick={async() => { await clientSignatureButtonClickedHandler(); } }>Client Signature</button> */}

                <label className="appLabel">Server:</label>
                <input className="appInput" id="serverSignatureID" readOnly></input>
                <button className="appButtonFetch" onClick={step3ServerRegisterButtonClickedHandler} id="step3Btn">Register</button>

                {(txRecord && <a href={txRecord} target="_blank" rel="noreferrer">{txRecord}</a>)}
            </div>

            <div className="appGridContainer appGridContainer04">
                <label className="stepLabel">Step #4</label>
                <div>Resolve</div>
                <div></div>

                <label className="appLabel">DID:</label>
                <input className="appInput" id="resolveID" readOnly></input>
                <button className="appButtonFetch" onClick={step4ResolveButtonClickedHandler} id="step4Btn">Resolve</button>

                <label className="appLabel">IPFS Hash:</label>
                <input className="appInput" id="serviceEndpointID" readOnly></input>
                <button className="appButtonFetch" onClick={step4FetchButtonClickedHandler} id="step4BtnFetch">Fetch</button>

                <label className="appLabel">Decrypted content:</label>
                <input className="appInput" id="decryptedContentID" readOnly></input>
                <div></div>
            </div>

            <div className="appGridContainer appGridContainer05">
                <label className="stepLabel">Step #5</label>
                <div>Update Access Permissions</div>
                <div></div>

                <ToggleButton onToggle={changeAccessPrivatePublic} isToggled={access}></ToggleButton><div></div><div></div>

                <label className="appLabel">Client:</label>
                <input className="appInput" id="clientSignatureStep5ID" readOnly></input>
                <button className="appButtonFetch" onClick={step5ClientSignatureButtonClickedHandler} id="step5BtnClientSig">Client Signature</button>

                <label className="appLabel">Write:</label>
                <input className="appInput" id="writeStep5ID" readOnly></input>
                <button className="appButtonFetch" onClick={step5WriteButtonClickedHandler} id="step5BtnWrite">Write</button>
            </div>
        </div>
    );
}

export default App;
