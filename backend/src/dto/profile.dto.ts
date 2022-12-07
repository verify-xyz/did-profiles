import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileContentDto {
    @IsNotEmpty()
    credentials: any;

    @IsNotEmpty()
    attributes: any;

    @IsString()
    template: string;
}

export class AuthSigDto {
    @IsString()
    address: string;

    @IsString()
    signature: string;

    @IsString()
    message: string;
}

export class ProfileDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => AuthSigDto)
    authSig: AuthSigDto;

    @IsDefined()
    @ValidateNested()
    @Type(() => ProfileContentDto)
    content: ProfileContentDto;
}
