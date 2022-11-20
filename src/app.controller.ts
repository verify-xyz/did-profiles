import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {ProfileDto} from "./dto/profileDto";

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  //Encrypt & Store
  @Post('encrypt')
  encryptProfile(@Body() body: ProfileDto) {
    console.log('encrypt', body)
    return this.appService.encryptProfile(body);
  }

  @Get('decrypt/:cid')
  decryptProfile(@Param('cid') cid: string) {
    console.log('decrypt', cid)
    return this.appService.decryptProfile(cid);
  }

}



