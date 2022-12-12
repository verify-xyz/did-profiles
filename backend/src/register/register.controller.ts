import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private readonly registerService: RegisterService) {}

    @Post('register')
    async registerBadge(@Body() { did, signature, service }: RegisterDto) {
        console.log('register', did);
        console.log('did: ' + did);
        console.log('signature: ' + signature);
        console.log('service: ' + service);

        const network = did.match(/^did:ethr:(.+):/)?.[1];

        const txHash = await this.registerService.addService(
            did,
            network,
            {
                type: 'test',
                serviceEndpoint: 'https://ipfs.io/ipfs/ID',
                ttl: 31536000,
                ...service,
            },
            signature,
        );

        console.log(txHash);

        return JSON.stringify(txHash);
    }
}
