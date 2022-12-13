import { Injectable } from '@nestjs/common';
import { AuthSigDto, ProfileContentDto, ProfileDto } from './dto/profile.dto';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    /**
     * Creates hardcoded ProfileDto
     * @param text Text message received from frontend application
     * @returns profileDto
     */
    createHardCodedProfileContentDto(text: string): ProfileContentDto {
        // Create hardcoded content. Only text message received from frontend is not hardcoded.
        const profileContentDto: ProfileContentDto = {
            template: text,
            credentials: 1,
            attributes: { a: '2' },
        };

        return profileContentDto;
    }
}
