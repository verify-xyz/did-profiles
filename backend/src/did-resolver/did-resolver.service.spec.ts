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
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'INFURA_NETWORK_ID') {
                                return 'eee90ba565f04be7880a63ee41082f17';
                            }
                            if (key === 'TEST_DID_ADDRESS') {
                                return '93fc3735ef4eee84c6c311f6f7afe56620a7e2e96dbffc0ef92e913f8b7c1fa4';
                            }
                            return null;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<DidResolverService>(DidResolverService);
        config = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('resolve a DID', async () => {
        const address = config.get('TEST_DID_ADDRESS');
        const did = `did:ethr:goerli:${address}`;

        const didDoc = await service.resolve(did);

        console.log(JSON.stringify(didDoc, null, 2));

        expect(didDoc).toBeTruthy();
    });
});
