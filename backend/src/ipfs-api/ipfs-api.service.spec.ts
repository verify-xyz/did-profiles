import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IpfsApiService } from './ipfs-api.service';

describe('IpfsApiService', () => {
    let service: IpfsApiService;
    let config: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule, ConfigModule],
            providers: [
                IpfsApiService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'IPFS_URL_ADD') {
                                return 'http://localhost:8080/ipfs/add';
                            }
                            if (key === 'IPFS_URL_READ') {
                                return 'http://127.0.0.1:8080/ipfs';
                            }
                            return null;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<IpfsApiService>(IpfsApiService);
        config = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('add & read a string', async () => {
        //const address = config.get('TEST_DID_ADDRESS');

        const hash = await service.addStringToIpfs('aaa');
        const text = await service.getStringFromIpfs(hash);

        expect(text).toBe('aaa');
    });
});
