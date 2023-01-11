import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CryptionService } from './cryption/cryption.service';
import { AddContentDto, AuthSigDto, ProfileContentDto, ProfileDto } from './dto/profile.dto';
import { EncryptedProfileDto } from './dto/encryptedProfile.dto';
import { IpfsApiService } from './ipfs-api/ipfs-api.service';
import { AuthSig } from './types';

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

    @Post('add')
    async encryptAndAddToIpfs(@Body() body: AddContentDto): Promise<string> {
        console.log(body);
        const profileContentDto: ProfileContentDto = this.appService.createHardCodedProfileContentDto(body.content);

        const encryptedString: string = await this.cryptionService.encryptProfile(profileContentDto, body.authSig);
        const result = await this.ipfsApiService.addStringToIpfs(encryptedString);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    @Get('read/:hash')
    async readFromIpfsAndDecrypt(@Param('hash') hash: string): Promise<string> {
        const encryptedProfileDto: EncryptedProfileDto = await this.ipfsApiService.getStringFromIpfs(hash);

        try {
            const decrypted: any = await this.cryptionService.decryptProfile(encryptedProfileDto);

            const response = { text: decrypted.content.template };
            const json = JSON.stringify(response);

            return json;
        } catch (e) {
            throw new HttpException('Profile is set to private. Unable to decrypt.', HttpStatus.PRECONDITION_REQUIRED);
        }
    }
    //did:ethr:goerli:0x32f8D7ae03e2963975F8cA76D1ff1D8D77752b70
}
