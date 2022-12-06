import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IpfsApiModule } from './ipfs-api/ipfs-api.module';
import { CryptionModule } from './cryption/cryption.module';
import { LitService } from './lit/lit.service';
import { CryptionService } from './cryption/cryption.service';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ConfigModule.forRoot(), IpfsApiModule, CryptionModule, HttpModule],
    controllers: [AppController],
    providers: [AppService, LitService, CryptionService, IpfsApiService],
})
export class AppModule {}
