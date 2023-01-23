import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";

export default function Manage() {
    const [transactionHash, setTransactionHash] = useState('None');

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

    return (
        <div className='Manage-main-container'>
            <div onClick={buttonChangeOwnershipClickedHandler} className="Manage-button" id="changeOwnershipButtonID">Change ownership</div>
            <label className="Manage-label" data-testid='labelTransactionHash'>Transaction Hash: <b>{transactionHash}</b></label>
        </div>
    );
};