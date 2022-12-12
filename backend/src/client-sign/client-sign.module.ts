import { Module } from '@nestjs/common';
import { ClientSignController } from './client-sign.controller';
import { ClientSignService } from './client-sign.service';

@Module({
    controllers: [ClientSignController],
    providers: [ClientSignService],
    exports: [ClientSignService],
})
export class ClientSignModule {}
