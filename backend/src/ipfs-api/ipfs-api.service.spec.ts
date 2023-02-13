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
            providers: [IpfsApiService, ConfigService],
        }).compile();

        service = module.get<IpfsApiService>(IpfsApiService);
        config = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('add & read a string', async () => {
        const hash = await service.addStringToIpfs('aaa');
        const text = await service.getStringFromIpfs(hash);

        expect(text).toBe('aaa');
    });
});
