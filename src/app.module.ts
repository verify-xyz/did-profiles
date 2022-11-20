import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LitService } from './lit/lit.service';
import { StorageService } from './storage/storage.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    LitService,
    StorageService,
  ],
})
export class AppModule {}
