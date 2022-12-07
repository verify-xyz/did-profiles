import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { LitService } from './lit/lit.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [AppController],
            providers: [AppService, CryptionService, LitService, IpfsApiService, ConfigService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
