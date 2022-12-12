import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dto/register.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private readonly registerService: RegisterService, private readonly configService: ConfigService) {}

    @Post('register')
    async registerProfile(@Body() { did, signature, service }: RegisterDto) {
        const network = did.match(/^did:ethr:(.+):/)?.[1];

        const txHash = await this.registerService.addService(
            did,
            network,
            {
                type: service.type,
                serviceEndpoint: this.configService.get('SERVICE_ENDPOINT') + signature,
                ttl: 31536000,
                ...service,
            },
            signature,
        );

        console.log(txHash);

        return JSON.stringify(txHash);
    }
}
