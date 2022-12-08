import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { ProfileContentDto, ProfileDto } from './dto/profile.dto';
import { EncryptedProfileDto } from './dto/encryptedProfile.dto';
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
        const profileContentDto: ProfileContentDto = this.appService.createHardCodedProfileContentDto(text);

        const encryptedString: string = await this.cryptionService.encryptProfile(profileContentDto);
        const result = await this.ipfsApiService.addStringToIpfs(encryptedString);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    @Get('read/:hash')
    async readFromIpfsAndDecrypt(@Param('hash') hash: string): Promise<string> {
        const encryptedProfileDto: EncryptedProfileDto = await this.ipfsApiService.getStringFromIpfs(hash);

        const decrypted: any = await this.cryptionService.decryptProfile(encryptedProfileDto);

        const response = { text: decrypted.content.template };
        const json = JSON.stringify(response);

        return json;
    }
}
