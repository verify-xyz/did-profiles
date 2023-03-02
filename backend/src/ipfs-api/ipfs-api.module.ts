
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IpfsApiController } from './ipfs-api.controller';
import { IpfsApiService } from './ipfs-api.service';

@Module({
    imports: [ConfigModule],
    controllers: [IpfsApiController],
    providers: [IpfsApiService],
    exports: [IpfsApiService],
})
export class IpfsApiModule {}
