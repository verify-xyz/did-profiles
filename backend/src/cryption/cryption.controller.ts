import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BadgeDto } from '../dto/badge.dto';
import { CryptionService } from './cryption.service';

@Controller('cryption')
export class CryptionController {
    constructor(private readonly cryptionService: CryptionService) {}

    //Encrypt & Store
    @Post('encrypt')
    encryptBadge(@Body() body: BadgeDto) {
        console.log('encrypt', body);
        return this.cryptionService.encryptBadge(body);
    }
}
