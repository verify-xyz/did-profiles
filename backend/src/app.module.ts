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
import { RegisterModule } from './register/register.module';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { ClientSignModule } from './client-sign/client-sign.module';
import { ClientSignController } from './client-sign/client-sign.controller';
import { ClientSignService } from './client-sign/client-sign.service';

@Module({
    imports: [ConfigModule.forRoot(), IpfsApiModule, CryptionModule, HttpModule, RegisterModule, ClientSignModule],
    controllers: [AppController, RegisterController, ClientSignController],
    providers: [AppService, LitService, CryptionService, IpfsApiService, RegisterService, ClientSignService],
})
export class AppModule {}
