import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { BadgeDto } from './dto/badge.dto';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly cryptionService: CryptionService,
        private readonly ipfsApiService: IpfsApiService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post('encrypt')
    async encryptBadge(@Body() body: BadgeDto) {
        console.log('encrypt', body);
        const encryptedString: string = await this.cryptionService.encryptBadge(body);
        const hash: string = await this.ipfsApiService.addStringToIpfs(encryptedString);
        console.log('-------encryptedString---------');
        console.log(encryptedString);
        console.log('-------hash---------');
        return hash;
    }
}
