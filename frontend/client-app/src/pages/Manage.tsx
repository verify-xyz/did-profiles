import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";
import { LitAuthSig, useLitAuthSig } from "../hooks/useLitAuthSig";

export default function Manage() {
    const { authSig, personalSign, account } = useLitAuthSig();
    const [currentAccount, setCurrentAccount] = useState('None');

    async function buttonChangeOwnershipClickedHandler() {
        await changeOwnership();
    }

    async function changeOwnership() {
        const provider = new Web3Provider((window as any).ethereum);

        const chainNameOrId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });

        console.log('accounts------------------------');
        console.log(accounts);

        const ethrDid = new EthrDID({
            identifier: accounts[0],
            chainNameOrId,
            provider: provider
        });

        const newOwner = await ethrDid.changeOwner(accounts[0]);
        console.log('new owner------------------------');
        console.log(newOwner);
        setCurrentAccount(newOwner);
    }

    return (
        <div className='Manage-main-container'>
            <div onClick={buttonChangeOwnershipClickedHandler} className="Manage-button">Change ownership</div>
            <label className="Manage-label">Current account: <b>{currentAccount}</b></label>

            {/* <div className='Manage-grid-container01'>
                <label className="Manage-label">Message:</label>
                <input className="Manage-input" id='messageID'></input>
                <div className="Manage-button" id="mabnageID" onClick={buttonManageClickedHandler}>Manage</div>
            </div> */}
        </div>
    );
};