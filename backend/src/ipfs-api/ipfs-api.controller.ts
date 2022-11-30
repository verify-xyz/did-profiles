import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IpfsApiService } from './ipfs-api.service';

@Controller('ipfs')
export class IpfsApiController {
    constructor(private readonly ipfsApiService: IpfsApiService) {}

    @Post('add')
    async addToIpfs(@Body() body: any) {
        const result = await this.ipfsApiService.addStringToIpfs(body.text);
        return result;
    }

    @Get('read/:hash')
    async readFromIpfs(@Param() hashCode: any): Promise<any> {
        const result = await this.ipfsApiService.getStringFromIpfs(hashCode.hash);
        return result;
    }
}
