import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IpfsApiService } from './ipfs-api.service';

@Controller('ipfs')
export class IpfsApiController {
    constructor(private readonly ipfsApiService: IpfsApiService) {}

    @Get('add/:text')
    async addToIpfs(@Param() text: any) {
        const result = await this.ipfsApiService.addStringToIpfs(text.text);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    @Get('read/:hash')
    async readFromIpfs(@Param() hash: any) {
        const result = await this.ipfsApiService.getStringFromIpfs(hash.hash);

        const response = { message: result };
        const json = JSON.stringify(response);

        return json;
    }
}
