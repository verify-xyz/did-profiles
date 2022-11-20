import { Test, TestingModule } from '@nestjs/testing';
import { LitService } from './lit.service';

const user = {
  signature: '0xfc467d442d3cf8f96228e4c950b51cdd2a90649343d69e6b838983e75ba241872171b3a92d5f5e12945621d59a924d5c26dca23d458e3cc7ae06f3edfef9f7291c',
  address: '0x939D7d1F84bF96100aD52ae6fE4195Cb38cE3bC8'
}

describe('LitService', () => {
  let service: LitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LitService],
    }).compile();

    service = module.get<LitService>(LitService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  it('should provision a JWT', async () => {
    const authSig = service.createAuthSig(user.signature, user.address);
    const result = await service.provisionAndSign(authSig);
    expect(result).toBeTruthy();
  }, 20000);
});
