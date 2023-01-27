import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import ServerAPI from '../api/serverAPI';
import { ToggleButton} from '../components/toggleButton';
import { RegisterServiceBodyWithAccess, RegisterServiceDto } from "../dto/register.dto";

export default function View() {
    const [ipfsHash, setIpfsHash] = useState('');
    const [message, setMessage] = useState('');
    const [access, setAccess] = useState(false);
    const [infoMessage, setInfoMessage] = useState('Information about specific actions is shown here.');
    let ethrDid : EthrDID;
    const serverAddress = getServerAddress();

    useEffect(() => {
        const hash = localStorage?.getItem('returnedHash');
        if (hash) {
            setIpfsHash(hash);
        }

        const msg = localStorage?.getItem('viewMessage');
        handleMessage(msg);
        
        initEthrDID();
    });

    async function initEthrDID() {
        const provider = new Web3Provider((window as any).ethereum);
        const chainNameOrId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];

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

    function getIpfsUrl2(): string {
        let ipfsUrl2 = process.env.REACT_APP_IPFS_URL2;

        if(!ipfsUrl2) {
            ipfsUrl2 = 'http://localhost:8080/ipfs/';
        }

        return ipfsUrl2;
    }

    function handleMessage(msg: string | null) {
        if (msg && access) {
            setMessage(msg);
        } else {
            if (!access) {
                localStorage.setItem('viewMessage', '');
            } else {
                setMessage('');
            }
        }
    }

    async function changeOwnershipToPrivate(newOwner: string) {
        setInfoMessage('Changing to private is in progress...');
        console.log('Change ownership to: ' + newOwner);
 
        // await initEthrDID(newOwner);
        const currentOwner = await ethrDid.lookupOwner();
        console.log('current owner: ' + currentOwner);

        await ethrDid.changeOwner(newOwner);

        setInfoMessage('Access is set to private.');

        console.log('OWNER CHANGED');
        const newestOwner = await ethrDid.lookupOwner();
        console.log('new owner: ' + newestOwner);
    }

    async function changeOwnershipToPublic(newOwner: string) {
        setInfoMessage('Changing to public is in progress...');
        
        const did = `did:ethr:goerli:${newOwner}`;
        const signature = '0x0';
        const cid = (document.getElementById('hashID') as HTMLInputElement).value;
        const service = new RegisterServiceDto('verify_xyz_profiles', getIpfsUrl2() + cid, cid);

        const registerServiceBodyWithAccess = new RegisterServiceBodyWithAccess(did, signature, service, 'public');
        const registerServiceBodyJSON = JSON.stringify(registerServiceBodyWithAccess);
        await ServerAPI.postRegisterServiceWithAccess(registerServiceBodyJSON);

        setInfoMessage('Access is set to public.');
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
            await changeOwnershipToPublic(accounts[0]);
            return;
        }

        if(newState === false) {
            console.log('change owner to PRIVATE');
            await changeOwnershipToPrivate(serverAddress);
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
                <div></div>

                <label className="View-label">Info:</label>
                <label className="View-label">{infoMessage}</label>
            </div>
        </div>
    );
};