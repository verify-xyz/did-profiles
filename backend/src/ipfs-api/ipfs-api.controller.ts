import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { IpfsApiService } from './ipfs-api.service';

@Controller('ipfs')
export class IpfsApiController {
    constructor(private readonly ipfsApiService: IpfsApiService) {}

    @Post('run-batch')
    async runBatch(@Body() body: any) {
        this.ipfsApiService.runBatch(body.something1, body.something2);
    }

    @Post('add')
    async addToIpfs(@Body() body: any) {
        console.log('controller-add');
        const result = await this.ipfsApiService.addStringToIpfs(body.text);
        return result;
    }
}
