import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('hello')
    async getHello2(): Promise<string> {
        const str = await this.appService.getHello2();
        const resp = { message: str };
        const json = JSON.stringify(resp);
        return json;
    }

    @Post('send-message')
    async sendMessage(@Body() data: any) {
        console.log('send-message');
        console.log(data);

        // Received message should be sent to IPFS

        const resp = { message: 'success' };
        const json = JSON.stringify(resp);
        return json;
    }

    @Post('get-message')
    async getMessage(@Body() data: any) {
        console.log('get-message');
        console.log(data);

        // Based on provided address, the message should be read and returned to frontend

        const resp = { message: 'message to return' };
        const json = JSON.stringify(resp);
        return json;
    }
}
