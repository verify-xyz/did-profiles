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

        const symmetricKey = await this.litNodeClient.getEncryptionKey({
            evmContractConditions: evmContractConditionsPublicView,
            toDecrypt: encryptedSymmetricKey,
            chain,
            authSig,
        });
        const decryptedFile: string = await LitJsSdk.decryptString(encryptedStr, symmetricKey);

        return decryptedFile;
    }
}
