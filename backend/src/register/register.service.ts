import { Injectable } from '@nestjs/common';
import { EthrDID } from 'ethr-did';
import { Wallet } from 'ethers';
import { splitSignature } from '@ethersproject/bytes';
import { NetworkUtils } from './network.utils';
import { ConfigService } from '@nestjs/config';
import {interpretIdentifier, EthrDidController} from "../did-resolver/ethr-did-resolver-PATCH";

const DEFAULT_GAS_LIMIT = 100000;

@Injectable()
export class RegisterService {
    private networkUtils: NetworkUtils;

    /**
     * Constructs RegisterService object
     * @param configService - config service
     */
    constructor(private readonly configService: ConfigService) {
        this.networkUtils = new NetworkUtils();
    }

    /**
     * Adds service
     * @param did Adds service
     * @param network - network
     * @param service - service object
     * @param signature - signature
     * @returns string
     */
    async addService(
        did: string,
        network: string,
        service: { serviceEndpoint: string; type: string; ttl: number },
        signature: string,
    ): Promise<object> {
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

        const metaEthrDid = await this.getEthrDidController(did, network, this.configService.get('GAS_PAYER_KEY'));
        console.log('ethrDid.addServiceSigned %o', {
            attrName,
            attrValue,
            ttl,
            gasLimit,
        });

        const meta = await metaEthrDid.setAttributeSigned(
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

        return {
            meta: meta,
            serviceEndpoint: attrValue,
        };
    }

    async getOwner(did: string) {
        const {network, address} = interpretIdentifier(did)
        const provider = this.networkUtils.getNetworkProviderFor(network);
        const controller = new EthrDidController(did,null,null,null, provider);

        return controller.getOwner(address);
    }

    /**
     * Changes owner
     * @param did - did
     * @param network - network
     * @param service - service object
     * @param signature - signature
     * @returns string
     */
    async changeOwner(
        did: string,
        network: string,
        service: { serviceEndpoint: string; type: string; ttl: number },
        newOwnerSignature: string,
        access: string,
    ): Promise<object> {
        const attrName = 'did/svc/' + service.type;
        const attrValue = service.serviceEndpoint;
        // const attrValue = this.configService.get('INFURA_IPFS_URL');
        const ttl = service.ttl;
        const gasLimit = DEFAULT_GAS_LIMIT;
        const accessValue = access;

        console.log('ethrDid.setAttribute %o', {
            attrName,
            attrValue,
            ttl,
            gasLimit,
        });

        console.log('signature: ' + newOwnerSignature);

        const canonicalSignature = splitSignature(newOwnerSignature);

        const metaEthrDid = await this.getEthrDidController(did, network, this.configService.get('GAS_PAYER_KEY'));
        console.log('ethrDid.addServiceSigned %o', {
            attrName,
            attrValue,
            ttl,
            gasLimit,
        });

        let accessString = this.configService.get('CABANA_PROFILE_PRIVATE_CONDITION');

        if (accessValue === 'public') {
            accessString = this.configService.get('CABANA_PROFILE_PUBLIC_CONDITION');
        }
        console.log('accessString: ' + accessString);

        // accessString = this.configService.get('CABANA_PROFILE_PUBLIC_CONDITION');

        const metaSignature = {
            sigV: canonicalSignature.v,
            sigR: canonicalSignature.r,
            sigS: canonicalSignature.s,
        };

        const meta = await metaEthrDid.changeOwnerSigned(accessString, metaSignature);
        console.log('meta: ' + meta);

        return {
            meta: meta,
            serviceEndpoint: attrValue,
        };
    }

    /**
     * Gets ethr did controller
     * @param did Gets ethr did controller
     * @param network - network
     * @param privateKey - private key
     * @returns EthrDID object
     */
    private async getEthrDidController(did: string, network: string, privateKey: string): Promise<EthrDID> {
        console.log('getEthrDidController', did, network);
        console.log('PRIVATE KEY: ' + privateKey);

        const provider = this.networkUtils.getNetworkProviderFor(network);

        return new EthrDID({
            identifier: did,
            provider: provider,
            txSigner: new Wallet(privateKey, provider),
        });
    }
}
