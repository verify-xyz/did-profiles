import { Test, TestingModule } from '@nestjs/testing';
import {RegisterService} from "./register.service";
import {ConfigService} from "@nestjs/config";

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
        const result = await service.getOwner('did:ethr:goerli:' + process.env.TEST_DID_ADDRESS);
        const isPublic = result === process.env.TEST_DID_ADDRESS;
        const isPrivate = result === configService.get('PROFILE_PRIVATE_CONDITION');
        console.log('result', result)
        expect(isPublic || isPrivate).toBeTruthy();
    }, 20000);
});
