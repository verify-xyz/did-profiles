import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import ServerAPI from '../api/serverAPI';
import { ToggleButton} from '../components/toggleButton';

export default function View() {
    const [ipfsHash, setIpfsHash] = useState('');
    const [message, setMessage] = useState('');
    const [access, setAccess] = useState(false);
    let ethrDid : EthrDID;
    const serverAddress = getServerAddress();

    useEffect(() => {
        const hash = localStorage?.getItem('returnedHash');
        if (hash) {
            setIpfsHash(hash);
        }

        const msg = localStorage?.getItem('viewMessage');
        handleMessage(msg);
        
        initEthrDID(serverAddress);
    });

    async function initEthrDID(address: string) {
        const provider = new Web3Provider((window as any).ethereum);
        const chainNameOrId = await (window as any).ethereum.request({ method: 'eth_chainId' });

        ethrDid = new EthrDID({
            identifier: address,
            chainNameOrId,
            provider: provider
        });
    }

    function getServerAddress(): string {
        let serverAddress = process.env.REACT_APP_SERVER_ADDRESS;

        if(!serverAddress) {
            serverAddress = '0xCfC5720bbeECbEe3133c8bB8f4902dEe1c88ceDD';
        }

        return serverAddress;
    }

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

    async function changeOwnership(newOwner: string) {
        console.log('Change ownership to: ' + newOwner);
 
        await initEthrDID(newOwner);

        await ethrDid.changeOwner(newOwner);
        console.log('OWNER CHANGED');
    }

    async function fetchButtonClickedHandler() {
        const msg = await ServerAPI.getMessageFromIPFS(ipfsHash);
        localStorage.setItem('viewMessage', msg);
        setMessage(msg);
    }

    async function changeAccessPrivatePublic() {
        const newState = !access;

        setAccess(!access);
        const serverAddress = getServerAddress();

        const owner = await ethrDid.lookupOwner();
        console.log('owner: ' + owner);

        if(newState === true) {
            console.log('change owner to PUBLIC');
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            await changeOwnership(accounts[0]);
            return;
        }

        if(newState === false) {
            console.log('change owner to PRIVATE');
            await changeOwnership(serverAddress);
            return;
        }

        /*if((newState === true) && (owner === serverAddress)) {
            console.log('change owner to PUBLIC');
            const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
            await changeOwnership(accounts[0]);
            return;
        }

        if(newState === false && owner === serverAddress) {
            (document.getElementById('receivedMessageID') as HTMLInputElement).value = 'Access is already private';
            return;
        }

        if(newState === true && owner !== serverAddress) {
            (document.getElementById('receivedMessageID') as HTMLInputElement).value = 'Access is already public';
            return;
        }

        if(newState === false && owner !== serverAddress) {
            console.log('change owner to PRIVATE');
            await changeOwnership(serverAddress);
            return;
        }*/
    }

    return (
        <div className='View-main-container'>
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