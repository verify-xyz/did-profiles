import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import ServerAPI from '../api/serverAPI';
import { ToggleButton} from '../components/toggleButton';

export default function View() {
    const [transactionHash, setTransactionHash] = useState('None');
    const [ipfsHash, setIpfsHash] = useState('');
    const [message, setMessage] = useState('');
    const [access, setAccess] = useState(false);

    useEffect(()=> {
        const hash = localStorage?.getItem('returnedHash');
        if (hash) {
            setIpfsHash(hash);
        }

        const msg = localStorage?.getItem('viewMessage');
        handleMessage(msg);
    });

    function handleMessage(msg: string | null) {
        if (msg && access) {
            setMessage(msg);
        } else {
            if (!access) {
                setMessage('Access is set to private');
                localStorage.setItem('viewMessage', '');
            } else {
                setMessage('');
            }
        }
    }

    async function buttonChangeOwnershipClickedHandler() {
        await changeOwnership();
    }

    async function changeOwnership() {
        setTransactionHash('None');

        const provider = new Web3Provider((window as any).ethereum);
        const chainNameOrId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });

        const ethrDid = new EthrDID({
            identifier: accounts[0],
            chainNameOrId,
            provider: provider
        });

        const newOwner = await ethrDid.changeOwner(accounts[0]);

        setTransactionHash(newOwner);
    }

    async function fetchButtonClickedHandler() {
        const msg = await ServerAPI.getMessageFromIPFS(ipfsHash);
        // (document.getElementById('receivedMessageID') as HTMLInputElement).value = msg;
        localStorage.setItem('viewMessage', msg);
        setMessage(msg);
    }

    async function changeAccessPrivatePublic() {
        setAccess(!access);

        if (!access) {
            changeOwnership();
        }
    }

    return (
        <div className='View-main-container'>
            <div onClick={buttonChangeOwnershipClickedHandler} className="View-button" id="changeOwnershipButtonID">Change ownership</div>
            <label className="View-label-transaction-hash" data-testid='labelTransactionHash'>Transaction Hash: <b>{transactionHash}</b></label>

            <div className="View-grid-container">
                <ToggleButton onToggle={changeAccessPrivatePublic} isToggled={access}></ToggleButton><div></div><div></div>

                <label className="View-label">IPFS Hash:</label>
                <input className="View-input-hash" id="hashID" readOnly value={ipfsHash}></input>
                <button className="View-button View-button-fetch" id="fetchID" onClick={fetchButtonClickedHandler}>Fetch</button>

                <label className="View-label">Message:</label>
                <input className="View-input" id="receivedMessageID" readOnly value={message}></input>
            </div>
        </div>
    );
};