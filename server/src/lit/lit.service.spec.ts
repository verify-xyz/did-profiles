import { Test, TestingModule } from '@nestjs/testing';
import { LitService } from './lit.service';

const user = {
    signature:
        '0xae1246f9acb0fdc6185e5eaf2df1d89f5d5957325c32cc5fe6a5f35f0cf72a1a32ec3db6631c1fe202ba4c448c34ffd5bdcecd6248f374785a652876cca9d07c1c',
    address: '0x2bCA59234a1Dd1B72b3756d489A89812c542F615',
    message: 'I am creating an account to use LIT at 2022-12-06T00:29:16.264Z',
};

describe('LitService', () => {
    let service: LitService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LitService],
        }).compile();

        service = module.get<LitService>(LitService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should provision a JWT', async () => {
        const authSig = service.createRandomAuthSig();
        const result = await service.provisionAndSign(authSig);
        expect(result).toBeTruthy();
    }, 20000);
});
