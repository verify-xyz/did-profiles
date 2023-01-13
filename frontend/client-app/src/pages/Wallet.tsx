import { useWeb3React } from "@web3-react/core"
import { injected } from "../utils/connector";
import { useLitAuthSig } from "../hooks/useLitAuthSig";

export default function Wallet() {
    const { active, account, library, connector, activate, deactivate } = useWeb3React();
    const { authSig, personalSign, reset } = useLitAuthSig();

    const signedMessage = authSig && authSig.signedMessage || 'Not signed';

    async function connect() {
        try {
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
            deactivate();
            reset();
        } catch (ex) {
            console.log(ex)
        }
    }

    return (
        <div className="Wallet-mainContainer">
            <div onClick={connect} className="Wallet-button">Connect to MetaMask</div>
            {active ? <span className="Wallet-connection">Connected with <b>{account}</b></span> : <span className="Wallet-connection">Not connected</span>}
            <div onClick={disconnect} className="Wallet-button">Disconnect</div>
            <div onClick={personalSign} className="Wallet-button Wallet-button-personal-sign">Personal Sign</div>
            <label className='Wallet-personal-sign-result'>Personal sign result: <b>{signedMessage}</b> </label>
        </div>
    )
}
