import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LitService } from './lit/lit.service';
import { CryptionService } from './cryption/cryption.service';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { HttpModule } from '@nestjs/axios';
import { RegisterModule } from './register/register.module';
import { DidResolverController } from './did-resolver/did-resolver.controller';
import { DidResolverService } from './did-resolver/did-resolver.service';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule, RegisterModule],
    controllers: [AppController, DidResolverController],
    providers: [AppService, LitService, CryptionService, IpfsApiService, DidResolverService],
})
export class AppModule {}
