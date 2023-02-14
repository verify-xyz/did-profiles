import { Injectable } from '@nestjs/common';
import { DIDResolutionOptions, DIDResolutionResult, Resolvable, Resolver } from 'did-resolver';
import { getResolver as ethrDidResolver } from 'ethr-did-resolver';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DidResolverService {
    private didResolver: Resolvable;
    private infuraNetworkID: string;

    /**
     * Constructs DidResolverService object
     */
    constructor(private readonly configService: ConfigService) {
        this.infuraNetworkID = this.configService.get('INFURA_NETWORK_ID');
    }

    /**
     * Resolve function
     * @param didUrl - URL
     * @param options - options
     * @returns resolved object
     */
    async resolve(didUrl: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult> {
        console.log('Resolving %s', didUrl);

        this.didResolver = new Resolver({
            ...ethrDidResolver({ infuraProjectId: this.infuraNetworkID }),
        });

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
