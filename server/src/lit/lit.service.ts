import { Injectable } from '@nestjs/common';
import * as LitJsSdk from 'lit-js-sdk/build/index.node.js';
import { AuthSig } from '../types';

import { Wallet } from 'ethers';
import { verifyMessage } from '@ethersproject/wallet';
import { joinSignature } from '@ethersproject/bytes';
import { hashMessage } from '@ethersproject/hash';

const client = new LitJsSdk.LitNodeClient({
    debug: false,
    alertWhenUnauthorized: false,
});
const chain = 'goerli';
const cabanaProfilePublicCondition = '0x0000000000000000000000000000000000000000';
const cabanaProfilePrivateCondition = '0x000000000000000000000000000000000000dEaD';

//Use Case - Going private (SC state updated to private, Gated access condition returns false for everyone, IPFS pin removed)
//1. Publish new profile. (Has unique DID)
//2. Make profile private. (By marking the registered DID as private).
//3. Publish new version of Profile
//4. Expect Lit.encryptString to throw BadConditionException

const evmContractConditionsPublicView = [
    {
        contractAddress: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b',
        chain: 'goerli',
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
     * @returns random authentication signature
     */
    createRandomAuthSig(): AuthSig {
        const wallet = Wallet.createRandom();
        // const privateKeyHex = wallet.privateKey.slice(2);
        const message = 'I am creating an account to use LIT at ' + new Date().toISOString();
        //Note: this is wallet.signMessage() without the promise
        const signature = joinSignature(wallet._signingKey().signDigest(hashMessage(message)));
        const recoverAddress = verifyMessage(message, signature);

        const authSig: AuthSig = {
            sig: signature,
            derivedVia: recoverAddress,
            signedMessage: message,
            address: recoverAddress,
        };

        return authSig;
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

    /**
     * Provisions and sign
     * @param authSig authentication signature
     * @returns boolean
     */
    async provisionAndSign(authSig: AuthSig) {
        if (!this.litNodeClient) {
            await this.connect();
        }

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
