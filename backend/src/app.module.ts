import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LitService } from './lit/lit.service';
import { CryptionService } from './cryption/cryption.service';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { HttpModule } from '@nestjs/axios';
import { RegisterModule } from './register/register.module';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule, RegisterModule],
    controllers: [AppController],
    providers: [AppService, LitService, CryptionService, IpfsApiService],
})
export class AppModule {}
