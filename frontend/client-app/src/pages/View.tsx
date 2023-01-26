import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState } from "react";

export default function View() {
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

    async function fetchButtonClickedHandler() {

    }

    return (
        <div className='View-main-container'>
            <div onClick={buttonChangeOwnershipClickedHandler} className="View-button" id="changeOwnershipButtonID">Change ownership</div>
            <label className="View-label-transaction-hash" data-testid='labelTransactionHash'>Transaction Hash: <b>{transactionHash}</b></label>

            <div className="View-grid-container">
                <label className="View-label">IPFS Hash:</label>
                <input className="View-input-hash" id="hashID" readOnly></input>
                <button className="View-button View-button-fetch" id="fetchID" onClick={fetchButtonClickedHandler}>Fetch</button>

                <label className="View-label">Message:</label>
                <input className="View-input" id="receivedMessageID" readOnly></input>
            </div>
        </div>
    );
};