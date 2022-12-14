import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DidResolverController } from './did-resolver.controller';
import { DidResolverService } from './did-resolver.service';

describe('DidResolverController', () => {
    let controller: DidResolverController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            controllers: [DidResolverController],
            providers: [DidResolverService],
        }).compile();

        controller = module.get<DidResolverController>(DidResolverController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
