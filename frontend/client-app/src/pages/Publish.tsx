
import ServerAPI from '../api/serverAPI';
import { LitAuthSig, useLitAuthSig } from "../hooks/useLitAuthSig";
import { EthrDID } from "ethr-did";
import { Web3Provider } from "@ethersproject/providers";

export default function Publish() {

    const { authSig, personalSign, account } = useLitAuthSig();

    console.log(authSig);

    async function buttonPublishClickedHandler() {
        const msg = (document.getElementById('messageID') as HTMLInputElement).value;
        console.log(msg);

        if (msg) {
            let activeAuthSig = authSig as LitAuthSig;

            if (!activeAuthSig) {
                activeAuthSig = await personalSign();
            }

            const response = await ServerAPI.sendMessageToIPFS(activeAuthSig, msg);
            console.log(response.hash);

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

        await ethrDid.setAttribute('did/svc/verify_xyz_profiles', process.env.REACT_APP_IPFS_URL2 + hash);
    }

    return (
        <div className='Publish-main-container'>
            <div className='Publish-grid-container01'>
                <label className="Publish-label">Message:</label>
                <input className="Publish-input" id='messageID'></input>
                <div className="Publish-button" id="publishID" onClick={buttonPublishClickedHandler}>Publish</div>
            </div>
        </div>
    );
};