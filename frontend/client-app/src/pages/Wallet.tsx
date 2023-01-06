import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import { injected } from "../utils/connector";

export default function Wallet() {
    const { active, account, library, connector, activate, deactivate } = useWeb3React();

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

    useEffect(() => {
        const connectWalletOnPageLoad = async () => {
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
            <button onClick={connect}>Connect to MetaMask</button>
            {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>}
            <button onClick={disconnect}>Disconnect</button>
        </div>
    )
}
