import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IpfsApiController } from './ipfs-api.controller';
import { IpfsApiService } from './ipfs-api.service';

@Module({
    imports: [HttpModule, ConfigModule],
    controllers: [IpfsApiController],
    providers: [IpfsApiService],
})
export class IpfsApiModule {}
