import { useEffect, useState } from "react";
import ServerAPI from '../api/serverAPI';
import { Web3Provider } from "@ethersproject/providers";
import { EthrDID } from 'ethr-did';

declare var window: any;

export default function Publish() {
    const [message, setMessage] = useState('');
    const [hash, setHash] = useState('');
    const [metaMask, setMetaMask] = useState('');

    useEffect(() => {
        console.log(message);
        console.log(hash);
        console.log(metaMask);
    });

    async function buttonPublishClickedHandler() {
        // SEND MESSAGE TO IPFS AND RECEIVE HASH
        const msg = (document.getElementById('messageID') as HTMLInputElement).value;
        setMessage(message);
        console.log(msg);

        const response = await ServerAPI.sendMessageToIPFS(msg);
        setHash(response.hash);
        console.log('Received hash: ' + response.hash);

        // SIGN TO METAMASK
        const provider = new Web3Provider(window.ethereum);
        const meta = await provider.send("eth_requestAccounts", []);
        setMetaMask(meta[0]);
        console.log(meta[0]);
        const signer = provider.getSigner();
        console.log(signer);
        const address = meta[0];

        // EthrDid
        const ethrDid = new EthrDID({
            provider, 
            identifier: `did:ethr:goerli:${address}`,
        });
        console.log('ethrDid------------------------------------------');
        console.log(ethrDid);
    }

    return (
        <div className='Publish-main-container'>
            <div className='Publish-grid-container01'>
                <label className="Publish-label">Message:</label>
                <input className="Publish-input" id='messageID'></input>
                <div className="Publish-button" id="publishID" onClick={buttonPublishClickedHandler}>Publish</div>
            </div>
        </div>
    );
};