import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { IpfsApiService } from './ipfs-api.service';

@Controller('ipfs')
export class IpfsApiController {
    constructor(private readonly ipfsApiService: IpfsApiService) {}

    @Post('add')
    async addToIpfs(@Body() body: any) {
        console.log('ipfs/add');
        const result = await this.ipfsApiService.addStringToIpfs(body.text);
        return result;
    }

    @Get('read/:hash')
    async readFromIpfs(@Param() hashCode: any): Promise<any> {
        console.log('ipfs/read');
        console.log(hashCode);
        console.log(hashCode.hash);
        const result = await this.ipfsApiService.getStringFromIpfs(hashCode.hash);
        // const result = this.ipfsApiService.getStringFromIpfsObservable(hashCode.hash);
        return result;
    }
}
