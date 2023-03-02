
import ServerAPI from '../api/serverAPI';
import { LitAuthSig, useLitAuthSig } from "../hooks/useLitAuthSig";
import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";
import { useState, useEffect } from 'react';

export default function Publish() {

    const { authSig, personalSign, account } = useLitAuthSig();

    console.log(authSig);

    const [returnedHash, setReturnedHash] = useState("None");
    const [message, setMessage] = useState('');

    useEffect(()=> {
        const msg = localStorage?.getItem('message');
        if (msg) {
            setMessage(msg);
            (document.getElementById('messageID') as HTMLInputElement).value = msg;
        }

        const hash = localStorage?.getItem('returnedHash');
        if (hash) {
            setReturnedHash(hash);
        }
        console.log('message: ' + localStorage?.getItem('message'));
        console.log('hash: ' + localStorage?.getItem('returnedHash'));
    });

    async function buttonPublishClickedHandler() {
        const msg = (document.getElementById('messageID') as HTMLInputElement).value;
        console.log(msg);

        if (msg) {
            let activeAuthSig: LitAuthSig | undefined;

            if (localStorage?.getItem('isWalletConnected') === "true" &&
                localStorage?.getItem('personalSignResult') !== null &&
                localStorage?.getItem('personalSignResult') !== undefined) {

                const personalSign: any = localStorage.getItem('personalSignResult');

                if (personalSign) {
                    activeAuthSig = JSON.parse(personalSign);
                }
            } else {
                activeAuthSig = authSig as LitAuthSig;

                if (!activeAuthSig) {
                    activeAuthSig = await personalSign();
                }
            }

            if(!activeAuthSig) {
                activeAuthSig = authSig as LitAuthSig;
            }

            const response = await ServerAPI.sendMessageToIPFS(activeAuthSig, msg);
            console.log(response.hash);
            setReturnedHash(response.hash);

            localStorage.setItem('message', msg);
            localStorage.setItem('returnedHash', response.hash);

            await sendRegisterTx(response.hash)
        }
    }

    async function sendRegisterTx(hash: string) {
        const provider = new Web3Provider((window as any).ethereum);

        const chainNameOrId = await (window as any).ethereum.request({ method: 'eth_chainId' });
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })

        const ethrDid = new EthrDID({
            identifier: accounts[0],
            chainNameOrId,
            provider: provider
        });

        await ethrDid.setAttribute('did/svc/verify_xyz_profiles', hash);
    }

    return (
        <div className='Publish-main-container'>
            <div className='Publish-grid-container01'>
                <label className="Publish-label" data-testid='labelMessage'>Message:</label>
                <input className="Publish-input" id='messageID'></input>
                <div className="Publish-button" id="publishID" onClick={buttonPublishClickedHandler}>Publish</div>
                <label className="Publish-label" id='returnHashID' data-testid='labelReturnedHash'>Returned hash:</label>
                <label><b>{returnedHash}</b></label>
            </div>
        </div>
    );
};
