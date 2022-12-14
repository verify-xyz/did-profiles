import { Injectable } from '@nestjs/common';
import { DIDResolutionOptions, DIDResolutionResult, Resolvable, Resolver } from 'did-resolver';

import { getResolver as ethrDidResolver } from 'ethr-did-resolver';

@Injectable()
export class DidResolverService {
    private didResolver: Resolvable;

    constructor() {
        if (!process.env.INFURA_NETWORK_ID) {
            throw new Error('Missing env - INFURA_NETWORK_ID');
        }

        this.didResolver = new Resolver({
            ...ethrDidResolver({ infuraProjectId: process.env.INFURA_NETWORK_ID }),
        });
    }

    async resolve(didUrl: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult> {
        console.log('Resolving %s', didUrl);

        const resolverOptions = {
            accept: 'application/did+ld+json',
            ...options,
        };

        const resolution = await this.didResolver.resolve(didUrl, resolverOptions);

        const defaults: DIDResolutionResult = {
            didDocumentMetadata: {},
            didResolutionMetadata: {},
            didDocument: null,
        };

        return {
            ...defaults,
            ...resolution,
        };
    }
}
