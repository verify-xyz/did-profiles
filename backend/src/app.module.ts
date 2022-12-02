import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IpfsApiModule } from './ipfs-api/ipfs-api.module';
import { CryptionModule } from './cryption/cryption.module';
import { LitService } from './lit/lit.service';

@Module({
    imports: [ConfigModule.forRoot(), IpfsApiModule, CryptionModule],
    controllers: [AppController],
    providers: [AppService, LitService],
})
export class AppModule {}
