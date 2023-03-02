import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IpfsApiService } from './ipfs-api.service';

describe('IpfsApiService', () => {
    let service: IpfsApiService;
    let config: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [IpfsApiService, ConfigService],
        }).compile();

        service = module.get<IpfsApiService>(IpfsApiService);
        config = module.get<ConfigService>(ConfigService);
    });

    afterAll(async () => {
        await service.shutdown();
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('add & read a string', async () => {
        const hash = await service.addStringToIpfs('aaa');
        console.log('hash', hash)
        const text = await service.getStringFromIpfs(hash);

        expect(text).toBe('aaa');
    });
});
