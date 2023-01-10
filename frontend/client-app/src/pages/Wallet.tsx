import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { injected } from "../utils/connector";
import { MetaMaskInpageProvider } from '@metamask/providers';
import { Buffer } from 'buffer';
// import { Buffer } from 'node:buffer';

/*declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
}*/

declare var window: any;

export default function Wallet() {
    const { active, account, library, connector, activate, deactivate } = useWeb3React();
    // const ethereum = window.ethereum as MetaMaskInpageProvider;
    const [personalSignResult, setPersonalSignResult] = useState('Not signed');

    async function connect() {
        try {
            console.log(injected);
            await activate(injected);

            if (active) {
                console.log('account: ' + account);
            } else {
                console.log('NOT CONNECTED');
            }

            localStorage.setItem('isWalletConnected', 'true');
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
            localStorage.setItem('isWalletConnected', 'false');
        } catch (ex) {
            console.log(ex)
        }
    }

    async function personalSign() {
        console.log('personal sign');

        const exampleMessage = 'Example `personal_sign` message';
        try {
            const from = account;
            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from, 'Example password'],
            });
            setPersonalSignResult(sign);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
            console.log('Connect wallet on page load');
            if (localStorage?.getItem('isWalletConnected') === 'true') {
                try {
                    await activate(injected)
                    localStorage.setItem('isWalletConnected', 'true');
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
        connectWalletOnPageLoad()
    }, []);

    return (
        <div className="Wallet-mainContainer">
            <div onClick={connect} className="Wallet-button">Connect to MetaMask</div>
            {active ? <span className="Wallet-connection">Connected with <b>{account}</b></span> : <span className="Wallet-connection">Not connected</span>}
            <div onClick={disconnect} className="Wallet-button">Disconnect</div>
            <div onClick={personalSign} className="Wallet-button Wallet-button-personal-sign">Personal Sign</div>
            <span className='Wallet-personal-sign-result'><label>Personal sign result:</label> {personalSignResult}</span>
        </div>
    )
}
