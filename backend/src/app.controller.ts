import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { BadgeDto } from './dto/badge.dto';
import { EncryptedBadgeDto } from './dto/encryptedBadge.dto';
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

    @Get('add/:text')
    async encryptAndAddToIpfs(@Param('text') text: string): Promise<string> {
        const badgeDto: BadgeDto = this.appService.createHardCodedBadgeDto(text);

        const encryptedString: string = await this.cryptionService.encryptBadge(badgeDto);
        const result = await this.ipfsApiService.addStringToIpfs(encryptedString);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    @Get('read/:hash')
    async readFromIpfsAndDecrypt(@Param('hash') hash: string): Promise<string> {
        const encryptedBadgeDto: EncryptedBadgeDto = await this.ipfsApiService.getStringFromIpfs(hash);

        const decrypted: any = await this.cryptionService.decryptBadge(encryptedBadgeDto);

        const response = { text: decrypted.content.template };
        const json = JSON.stringify(response);

        return json;
    }
}
