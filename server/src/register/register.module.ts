import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
    imports: [ConfigModule],
    controllers: [RegisterController],
    providers: [RegisterService],
    exports: [RegisterService],
})
export class RegisterModule {}
