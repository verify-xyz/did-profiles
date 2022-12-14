import { Test, TestingModule } from '@nestjs/testing';
import { DidResolverService } from './did-resolver.service';

describe('DidResolverService', () => {
    let service: DidResolverService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DidResolverService],
        }).compile();

        service = module.get<DidResolverService>(DidResolverService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('resolve a DID', async () => {
        const did = `did:ethr:goerli:${process.env.TEST_DID_ADDRESS}`;

        const didDoc = await service.resolve(did);

        console.log(JSON.stringify(didDoc, null, 2));

        expect(didDoc).toBeTruthy();
    });
});
