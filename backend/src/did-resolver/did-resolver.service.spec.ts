import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DidResolverService } from './did-resolver.service';

describe('DidResolverService', () => {
    let service: DidResolverService;
    let config: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [
                DidResolverService,
                ConfigService
            ],
        }).compile();

        service = module.get<DidResolverService>(DidResolverService);
        config = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('resolve a DID', async () => {
        const address = config.get('CLIENT_ADDRESS');
        const did = `did:ethr:goerli:${address}`;

        const didDoc = await service.resolve(did);

        console.log(JSON.stringify(didDoc, null, 2));

        expect(didDoc).toBeTruthy();
    }, 200000);
});
