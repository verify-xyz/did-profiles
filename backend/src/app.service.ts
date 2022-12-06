import { Injectable } from '@nestjs/common';
import { AuthSigDto, BadgeContentDto, BadgeDto } from './dto/badge.dto';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    /**
     * Creates hardcoded BadgeDto
     * @param text Text message received from frontend application
     * @returns badgeDto
     */
    createFakeBadgeDto(text: string): BadgeDto {
        // Create hardcoded content
        const content: BadgeContentDto = {
            template: 'profile',
            credentials: 1,
            attributes: { a: '2' },
        };

        //  Create hardcoded authSig. Only message received from frontend is not hardcoded.
        const authSig: AuthSigDto = {
            signature:
                '0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b',
            message: text,
            address: '0xdbd360f30097fb6d938dcc8b7b62854b36160b45',
        };

        const badgeDto: BadgeDto = {
            content: content,
            authSig: authSig,
        };

        return badgeDto;
    }
}
