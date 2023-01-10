import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import { injected } from "../utils/connector";
import { Buffer } from 'buffer';

declare var window: any;

export default function Wallet() {
    const { active, account, library, connector, activate, deactivate } = useWeb3React();
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
        const date = new Date();
        const exampleMessage = `I am creating an account to use LIT at ${date}`;

        try {
            const from = account;
            const msg = `0x${Buffer.from(exampleMessage, 'utf8').toString('hex')}`;
            const sign = await window.ethereum.request({
                method: 'personal_sign',
                params: [msg, from, 'Example password'],
            });
            setPersonalSignResult(sign);
            localStorage.setItem('personalsignResult', sign);
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
            <label className='Wallet-personal-sign-result'>Personal sign result: <b>{personalSignResult}</b> </label>
        </div>
    )
}
