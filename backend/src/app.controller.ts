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
        console.log('Helo');
        const str = await this.appService.getHello2();
        const resp = { message: str };
        const json = JSON.stringify(resp);
        return json;
    }

    @Post('send-message')
    async confirmOTP(@Body() data: any) {
        console.log('send-message');
        console.log(data.message);
    }
}
