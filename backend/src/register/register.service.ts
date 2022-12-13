import { Injectable } from '@nestjs/common';
import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';
import { splitSignature } from '@ethersproject/bytes';
import { NetworkUtils } from './network.utils';

const DEFAULT_GAS_LIMIT = 100000;

@Injectable()
export class RegisterService {
    private networkUtils: NetworkUtils;

    constructor() {
        if (!process.env.GAS_PAYER_KEY) {
            throw new Error('Missing env - GAS_PAYER_KEY');
        }

        this.networkUtils = new NetworkUtils();
    }

    async addService(
        did: string,
        network: string,
        service: { serviceEndpoint: string; type: string; ttl: number },
        signature: string,
    ): Promise<string> {
        const attrName = 'did/svc/' + service.type;
        const attrValue = service.serviceEndpoint;
        const ttl = service.ttl;
        const gasLimit = DEFAULT_GAS_LIMIT;

        console.log('ethrDid.setAttribute %o', {
            attrName,
            attrValue,
            ttl,
            gasLimit,
        });

        const canonicalSignature = splitSignature(signature);

        const metaEthrDid = await this.getEthrDidController(did, network, process.env.GAS_PAYER_KEY);
        console.log('ethrDid.addServiceSigned %o', {
            attrName,
            attrValue,
            ttl,
            gasLimit,
        });

        return metaEthrDid.setAttributeSigned(
            attrName,
            attrValue,
            ttl,
            {
                sigV: canonicalSignature.v,
                sigR: canonicalSignature.r,
                sigS: canonicalSignature.s,
            },
            {
                gasLimit,
            },
        );
    }

    private async getEthrDidController(did: string, network: string, privateKey: string): Promise<EthrDID> {
        console.log('getEthrDidController', did, network);

        const provider = this.networkUtils.getNetworkProviderFor(network);

        return new EthrDID({
            identifier: did,
            provider: provider,
            txSigner: new Wallet(privateKey, provider),
        });
    }
}
