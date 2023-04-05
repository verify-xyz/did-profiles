import { Module } from '@nestjs/common';
import { EncryptService } from './encrypt.service';
import { LitService } from '../lit/lit.service';

@Module({
    providers: [EncryptService, LitService],
    exports: [EncryptService],
})
export class EncryptModule {}
