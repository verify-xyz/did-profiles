import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ClientSignatureBody } from '../dto/register.dto';
import { ClientSignService } from './client-sign.service';

@Controller()
export class ClientSignController {
    constructor(private readonly clientSignService: ClientSignService) {}

    @Post('client/signature')
    async clientSignUpdate(@Body() body: ClientSignatureBody /*, @Res() res: Response*/) {
        console.log('client/signature', body);
        const result = await this.clientSignService.createSignatureAddService(body.network, body.service);
        console.log(result);
        return JSON.stringify(result);
    }
}
