import { Controller, Get, Param } from '@nestjs/common';
import { IpfsApiService } from './ipfs-api.service';

@Controller('ipfs')
export class IpfsApiController {
    constructor(private readonly ipfsApiService: IpfsApiService) {}

    // Left for test purposes. Can be used from Postman
    @Get('add/:text')
    async addToIpfs(@Param('text') text: string): Promise<string> {
        const result = await this.ipfsApiService.addStringToIpfs(text);

        const response = { hash: result };
        const json = JSON.stringify(response);

        return json;
    }

    // Left for test purposes. Can be used from Postman
    @Get('read/:hash')
    async readFromIpfs(@Param('hash') hash: string): Promise<string> {
        const result = await this.ipfsApiService.getStringFromIpfs(hash);

        const response = { text: result };
        const json = JSON.stringify(response);

        return json;
    }
}
