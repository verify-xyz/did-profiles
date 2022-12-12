import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';

import { SigningKey } from '@ethersproject/signing-key';
import { NetworkUtils } from './network-utils';
import { Buffer } from 'buffer';

export class ClientSign {
    networkUtils = new NetworkUtils();

    constructor() {
        this.networkUtils = new NetworkUtils();

        if (!process.env.REACT_APP_TEST_DID_KEY) {
            throw new Error('Missing env - TEST_DID_KEY');
        }
    }

    // This generates the signature needed for server-side /register
    // privateKey is the user's DID key. This signature will be used to write a service attribute to the EthrDID contract.
    async createSignatureAddService(network, service) {
        const provider = this.networkUtils.getNetworkProviderFor(network);
        console.log(`network: ${network}`);
        console.log(`service.type: ${service.type}`);
        console.log(`service.serviceEndpoint: ${service.serviceEndpoint}`);

        console.log('provider----------------------------------------');
        console.log(provider);
        // provider.connection.url = 'https://goerli.infura.io/v3/eee90ba565f04be7880a63ee41082f17';

        console.log(process.env.REACT_APP_TEST_DID_KEY);
        const wallet = new Wallet(process.env.REACT_APP_TEST_DID_KEY, provider);
        console.log('wallet----------------------------------------');
        console.log(wallet);

        const did = `did:ethr:${network}:${wallet.address}`;

        const ethrDid = new EthrDID({
            identifier: did,
            provider,
            txSigner: wallet
        });

        const attrName = 'did/svc/' + service.type;
        const attrValue = service.serviceEndpoint;
        const ttl = 31536000;

        console.log('ethrDid.setAttribute %o', { attrName, attrValue, ttl });
        console.log('HERE IS THE PROBLEM');

        const metaHash = await ethrDid.createSetAttributeHash(
            attrName,
            attrValue,
            ttl
        );

        return this.eth_rawSign(
            process.env.REACT_APP_TEST_DID_KEY,
            Buffer.from(strip0x(metaHash), 'hex')
        );
    }

    eth_rawSign(managedKey, data) {
        return new SigningKey('0x' + strip0x(managedKey)).signDigest(data).compact;
    }
}

function strip0x(input) {
    return input.startsWith('0x') ? input.slice(2) : input;
}
