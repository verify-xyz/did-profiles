import { Injectable } from '@nestjs/common';
import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';

import { SigningKey } from '@ethersproject/signing-key';
import { NetworkUtils } from '../register/network.utils';

@Injectable()
export class ClientSignService {
    private networkUtils: NetworkUtils;

    constructor() {
        this.networkUtils = new NetworkUtils();

        if (!process.env.TEST_DID_KEY) {
            throw new Error('Missing env - TEST_DID_KEY');
        }
    }

    //This generates the signature needed for server-side /register
    //privateKey is the user's DID key. This signature will be used to write a service attribute to the EthrDID contract.
    async createSignatureAddService(
        network: string,
        service: { type: string; serviceEndpoint: string },
    ): Promise<string> {
        const provider = this.networkUtils.getNetworkProviderFor(network);
        console.log(provider);

        const wallet = new Wallet(process.env.TEST_DID_KEY, provider);

        const did = `did:ethr:${network}:${wallet.address}`;

        const ethrDid = new EthrDID({
            identifier: did,
            provider,
            txSigner: wallet,
        });

        const attrName = 'did/svc/' + service.type;
        const attrValue = service.serviceEndpoint;
        const ttl = 31536000;

        console.log('ethrDid.setAttribute %o', { attrName, attrValue, ttl });

        const metaHash = await ethrDid.createSetAttributeHash(attrName, attrValue, ttl);

        return this.eth_rawSign(process.env.TEST_DID_KEY, Buffer.from(strip0x(metaHash), 'hex'));
    }

    private eth_rawSign(managedKey: string, data: Uint8Array) {
        return new SigningKey('0x' + strip0x(managedKey)).signDigest(data).compact;
    }
}

function strip0x(input: string): string {
    return input.startsWith('0x') ? input.slice(2) : input;
}
