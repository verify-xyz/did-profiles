import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { injected } from "../utils/connector";
import { Buffer } from "buffer";
// import { Web3Provider } from "@ethersproject/providers";

//-----------------------------------
//required for ethr-did
// @ts-ignore
window.Buffer = Buffer;
//-----------------------------------

export type LitAuthSig = {
    sig: string;
    derivedVia: string;
    signedMessage: string;
    address: string;
};

export const useLitAuthSig = () => {
    const { activate, account } = useWeb3React();
    const [connected, setConnected] = useState<boolean>(false);
    const [personalSignResult, setPersonalSignResult] = useState<LitAuthSig>();

    useEffect(() => {
        const authSigStr = localStorage.getItem("personalSignResult");

        if (authSigStr) {
            const authSig: LitAuthSig = JSON.parse(authSigStr);

            if (authSig.address === account) {
                setPersonalSignResult(authSig);
            }
        }

        const connectWalletOnPageLoad = async () => {
            if (localStorage?.getItem("isWalletConnected") === "true") {
                try {
                    await activate(injected);
                    localStorage.setItem("isWalletConnected", "true");
                    setConnected(true);
                } catch (ex) {
                    console.log(ex);
                    setConnected(false);
                }
            } else {
                setConnected(false);

                const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    personalSign();
                    setConnected(true);
                }
            }
        };
        connectWalletOnPageLoad();
    }, [activate, account]);

    const personalSign = async () => {
        let address = account as string;

        if (!connected) {
            await activate(injected);

            localStorage.setItem("isWalletConnected", "true");

            address = await (window as any).ethereum.selectedAddress;
        }

        const message =
            "I am creating an account to use LIT at " +
            new Date().toISOString();

        const from = address;
        const msg = `0x${Buffer.from(message, "utf8").toString("hex")}`;
        const sign = await (window as any).ethereum.request({
            method: "personal_sign",
            params: [msg, from, "Example password"],
        });

        const authSig: LitAuthSig = {
            sig: sign,
            address,
            signedMessage: message,
            derivedVia: "web3.eth.personal.sign",
        };

        setPersonalSignResult(authSig);

        localStorage.setItem("personalSignResult", JSON.stringify(authSig));

        return authSig;
    };

    const reset = () => {
        localStorage.clear();
        setPersonalSignResult(undefined);
    };

    return {
        account,
        reset,
        personalSign,
        authSig: personalSignResult,
    };
};
