import { Body, Controller, Post } from '@nestjs/common';
import { ProfileDto } from '../dto/profile.dto';
import { CryptionService } from './cryption.service';

@Controller('cryption')
export class CryptionController {
    constructor(private readonly cryptionService: CryptionService) {}

    // Left for test purposes. Can be used from Postman
    @Post('encrypt')
    encryptProfile(@Body() body: ProfileDto) {
        console.log('encrypt', body);
        return this.cryptionService.encryptProfile(body);
    }
}
