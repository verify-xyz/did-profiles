import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';

import { SigningKey } from '@ethersproject/signing-key';
import { NetworkUtils } from './network-utils';
import { Buffer } from 'buffer';

export class ClientSign {
    networkUtils = new NetworkUtils();

    /**
     * Constructs ClientSign object
     */
    constructor() {
        this.networkUtils = new NetworkUtils();

        if (!process.env.REACT_APP_CLIENT_PRIVATE_KEY) {
            throw new Error('Missing env - CLIENT_PRIVATE_KEY');
        }
    }

    /**
     * Generates the signature needed for server-side /register. privateKey is the user's DID key.
     * This signature will be used to write a service attribute to the EthrDID contract.
     * @param {*} network - network
     * @param {*} service - service
     * @returns - client signature
     */
    async createSignatureAddService(network, service) {
        const provider = this.networkUtils.getNetworkProviderFor(network);
        const wallet = new Wallet(process.env.REACT_APP_CLIENT_PRIVATE_KEY, provider);
        const did = `did:ethr:${network}:${wallet.address}`;

        const ethrDid = new EthrDID({
            identifier: did,
            provider,
            txSigner: wallet
        });

        const attrName = 'did/svc/' + service.type;
        const attrValue = service.serviceEndpoint;
        const ttl = 31536000;

        const metaHash = await ethrDid.createSetAttributeHash(
            attrName,
            attrValue,
            ttl
        );

        return this.eth_rawSign(
            process.env.REACT_APP_CLIENT_PRIVATE_KEY,
            Buffer.from(strip0x(metaHash), 'hex')
        );
    }

    /**
     * Changes owner hash
     * @param {any} network - network
     * @param {string} newOwner - newOwner
     * @returns new owner hash
     */
    async createSignatureChangeOwner(network, newOwner) {
        const provider = this.networkUtils.getNetworkProviderFor(network);
        const wallet = new Wallet(process.env.REACT_APP_CLIENT_PRIVATE_KEY, provider);
        const did = `did:ethr:${network}:${wallet.address}`;

        const ethrDid = new EthrDID({
            identifier: did,
            provider,
            txSigner: wallet
        });

        const metaHash = await ethrDid.createChangeOwnerHash(newOwner);

        return this.eth_rawSign(
            process.env.REACT_APP_CLIENT_PRIVATE_KEY,
            Buffer.from(strip0x(metaHash), 'hex')
        );
    }

    /**
     * Creates signing key
     * @param {any} managedKey - managed key
     * @param {string} data - data
     * @returns signing key
     */
    eth_rawSign(managedKey, data) {
        return new SigningKey('0x' + strip0x(managedKey)).signDigest(data).compact;
    }
}

/**
 * Formats input
 * @param {hexa number} input - hexa number
 * @returns input
 */
function strip0x(input) {
    return input.startsWith('0x') ? input.slice(2) : input;
}
