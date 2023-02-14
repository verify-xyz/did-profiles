import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

const text = 'message';

describe('appService', () => {
    let service: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService],
        }).compile();

        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create hard coded profile with dynamic text', async () => {
        const content = await service.createHardCodedProfileContentDto(text);
        expect(content.template).toBe(text);
    }, 20000);
});
