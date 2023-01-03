import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto, RegisterDtoWithAccess } from '../dto/register.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private readonly registerService: RegisterService, private readonly configService: ConfigService) {}

    @Post('register')
    async registerProfile(@Body() { did, signature, service }: RegisterDto) {
        const txHash = await this.registerService.addService(
            did,
            {
                type: service.type,
                serviceEndpoint: this.configService.get('SERVICE_ENDPOINT') + service.ipfsHash,
                ttl: 31536000,
                ...service,
            },
            signature,
        );

        console.log(txHash);

        return JSON.stringify(txHash);
    }

    @Post('register/access')
    async registerProfileWithAccess(@Body() { did, signature, service, access }: RegisterDtoWithAccess) {
        console.log('register/access');
        console.log('access: ' + access);

        const currentOwner = await this.registerService.getOwner(did);
        const isPrivate = currentOwner === this.configService.get('PROFILE_PRIVATE_CONDITION');

        console.log(currentOwner, isPrivate);

        if (access === 'public') {
            if (!isPrivate) {
                throw new HttpException('Access is already public', HttpStatus.PRECONDITION_FAILED);
            }
        } else if (isPrivate) {
            throw new HttpException('Access is already private', HttpStatus.PRECONDITION_FAILED);
        }

        const txHash = await this.registerService.changeOwner(
            did,
            {
                type: service.type,
                serviceEndpoint: this.configService.get('SERVICE_ENDPOINT') + service.ipfsHash,
                ttl: 31536000,
                ...service,
            },
            signature,
            access,
        );

        console.log(txHash);

        return JSON.stringify(txHash);
    }
}
