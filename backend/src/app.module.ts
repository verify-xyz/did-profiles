import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { IpfsApiModule } from './ipfs-api/ipfs-api.module';

@Module({
    imports: [ConfigModule.forRoot(), IpfsApiModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
