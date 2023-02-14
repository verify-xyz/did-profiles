import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { ConfigService } from '@nestjs/config';

describe('register', () => {
    let service: RegisterService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService, RegisterService],
        }).compile();

        service = module.get<RegisterService>(RegisterService);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get current access state', async () => {
        const result = await service.getOwner('did:ethr:goerli:' + configService.get('CLIENT_ADDRESS'));
        const isPublic = result === configService.get('CLIENT_ADDRESS');
        const isPrivate = result === configService.get('SERVER_ADDRESS');
        console.log('result', result);
        expect(isPublic || isPrivate).toBeTruthy();
    }, 20000);
});
