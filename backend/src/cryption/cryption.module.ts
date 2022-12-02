import { Module } from '@nestjs/common';
import { CryptionController } from './cryption.controller';
import { CryptionService } from './cryption.service';
import { LitService } from '../lit/lit.service';

@Module({
    controllers: [CryptionController],
    providers: [CryptionService, LitService],
})
export class CryptionModule {}
