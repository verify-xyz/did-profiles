import { Module } from '@nestjs/common';
import { CryptionService } from './cryption.service';
import { LitService } from '../lit/lit.service';

@Module({
    providers: [CryptionService, LitService],
})
export class CryptionModule {}
