import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DidResolverController } from './did-resolver.controller';
import { DidResolverService } from './did-resolver.service';

@Module({
    imports: [ConfigModule],
    controllers: [DidResolverController],
    providers: [DidResolverService],
    exports: [DidResolverService],
})
export class DidResolverModule {}
