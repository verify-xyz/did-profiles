import { Injectable } from '@nestjs/common';
import * as LitJsSdk from 'lit-js-sdk/build/index.node.js';
import { AuthSig } from '../types';

const client = new LitJsSdk.LitNodeClient({
    debug: false,
    alertWhenUnauthorized: false,
});
const chain = 'ethereum';
const cabanaBadgePublicCondition = '0x0000000000000000000000000000000000000000';
const cabanaBadgePrivateCondition = '0x000000000000000000000000000000000000dEaD';

//Use Case - Going private (SC state updated to private, Gated access condition returns false for everyone, IPFS pin removed)
//1. Publish new badge. (Has unique DID)
//2. Make badge private. (By marking the registered DID as private).
//3. Publish new version of Badge
//4. Expect Lit.encryptString to throw BadConditionException

const evmContractConditionsPublicView = [
    {
        contractAddress: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
        chain: 'ethereum',
        functionName: 'identityOwner',
        functionParams: [':userAddress'],
        functionAbi: {
            name: 'identityOwner',
            inputs: [{ name: 'identity', type: 'address', internalType: 'address' }],
            outputs: [{ name: '', type: 'address', internalType: 'address' }],
            stateMutability: 'view',
            type: 'function',
            payable: false,
            constant: true,
        },
        returnValueTest: {
            key: '',
            comparator: '=',
            value: ':userAddress',
        },
    },
];

@Injectable()
export class LitService {
    private litNodeClient;

    private async connect() {
        await client.connect();
        this.litNodeClient = client;
    }

    /**
     * Creates authentication signature
     * @param sig - signature
     * @param address - address
     * @param signedMessage - signed message
     * @returns authentication signature
     */
    createAuthSig(sig: string, address: string, signedMessage?: string): AuthSig {
        return {
            sig,
            derivedVia: 'web3.eth.personal.sign',
            signedMessage: signedMessage || 'My signature is my passport',
            address,
        };
    }

    /**
     * Encrypts string
     * @param authSig - authentication signature
     * @param str - string
     * @returns - encrypted string & encrypted symmetric key
     */
    async encryptString(authSig: AuthSig, str: string) {
        if (!this.litNodeClient) {
            await this.connect();
        }
        //const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(str);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            evmContractConditions: evmContractConditionsPublicView,
            symmetricKey,
            authSig,
            chain,
        });

        return {
            encryptedFile: encryptedString,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
        };
    }

    /**
     * Decrypts string
     * @param authSig - authenticated signature
     * @param encryptedStr - encrypted string
     * @param encryptedSymmetricKey - encrypted symetric key
     * @returns decrypted string
     */
    async decryptString(authSig: AuthSig, encryptedStr, encryptedSymmetricKey) {
        if (!this.litNodeClient) {
            await this.connect();
        }
        // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        const symmetricKey = await this.litNodeClient.getEncryptionKey({
            evmContractConditions: evmContractConditionsPublicView,
            toDecrypt: encryptedSymmetricKey,
            chain,
            authSig,
        });
        const decryptedFile: string = await LitJsSdk.decryptString(encryptedStr, symmetricKey);

        return decryptedFile;
    }

    /**
     * Provision and sign
     * @param authSig - authentication signature
     * @returns boolean
     */
    async provisionAndSign(authSig: AuthSig) {
        if (!this.litNodeClient) {
            await this.connect();
        }

        // let authSig = JSON.parse("{\"sig\":\"0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b\",\"derivedVia\":\"web3.eth.personal.sign\",\"signedMessage\":\"I am creating an account to use LITs at 2021-08-04T20:14:04.918Z\",\"address\":\"0xdbd360f30097fb6d938dcc8b7b62854b36160b45\"}")

        // const authSig = {
        //     sig: '0x107b55c16f0099a80347ca364ae3035ad06ccbc11a43e306fbf506337fad90b62c6c670e081c166942e71d71f9aa4b2b9f8749c0645a0d89a8cf6469331d74221b',
        //     derivedVia: 'web3.eth.personal.sign',
        //     signedMessage: 'My voice is my passport',
        //     address: '0x939D7d1F84bF96100aD52ae6fE4195Cb38cE3bC8'
        // }

        console.log(authSig);

        const randomPath = () =>
            '/' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const resourceId = {
            baseUrl: 'my-dynamic-content-server.com',
            path: randomPath(),
            orgId: '',
            role: '',
            extraData: '',
        };

        await this.litNodeClient.saveSigningCondition({
            evmContractConditions: evmContractConditionsPublicView,
            chain,
            authSig,
            resourceId,
        });

        const jwt = await this.litNodeClient.getSignedToken({
            evmContractConditions: evmContractConditionsPublicView,
            chain,
            authSig,
            resourceId,
        });

        console.log(jwt);

        const { verified, header, payload } = LitJsSdk.verifyJwt({ jwt });
        console.log('verified', verified);
        console.log('header', header);
        console.log('payload', payload);

        if (jwt) {
            return true;
        }
        return false;
    }
}
