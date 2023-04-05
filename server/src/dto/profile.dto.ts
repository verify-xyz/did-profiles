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
    sig: string;

    @IsString()
    signedMessage: string;

    @IsString()
    derivedVia: string;
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

export class AddContentDto {
    @IsString()
    content: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => AuthSigDto)
    authSig: AuthSigDto;
}
