import { Controller, Get, Param } from '@nestjs/common';
import { DidResolverService } from './did-resolver.service';

@Controller()
export class DidResolverController {
    constructor(private resolver: DidResolverService) {}

    @Get('resolve/:did')
    resolveDID(@Param('did') did: string) {
        return this.resolver.resolve(did);
    }
}
