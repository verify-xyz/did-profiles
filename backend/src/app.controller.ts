import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { AuthSigDto, BadgeContentDto, BadgeDto } from './dto/badge.dto';
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
        console.log(hash);
        return hash;
    }

    @Get('add/:text')
    async addToIpfs(@Param('text') text: string): Promise<string> {
        // Create hardcoded content
        const content: BadgeContentDto = {
            template: 'profile',
            credentials: 1,
            attributes: { a: '2' },
        };

        //  Create hardcoded authSig. Only message received from frontend is not hardcoded.
        const authSig: AuthSigDto = {
            signature:
                '0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b',
            message: text,
            address: '0xdbd360f30097fb6d938dcc8b7b62854b36160b45',
        };

        const badgeDto: BadgeDto = {
            content: content,
            authSig: authSig,
        };

        const encryptedString: string = await this.cryptionService.encryptBadge(badgeDto);
        const result = await this.ipfsApiService.addStringToIpfs(encryptedString);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    @Get('read/:hash')
    async readFromIpfs(@Param('hash') hash: string): Promise<string> {
        const result = await this.ipfsApiService.getStringFromIpfs(hash);

        const response = { text: result };
        const json = JSON.stringify(response);

        return json;
    }
}
