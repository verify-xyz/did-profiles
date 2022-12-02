import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BadgeContentDto {
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

export class BadgeDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => AuthSigDto)
    authSig: AuthSigDto;

    @IsDefined()
    @ValidateNested()
    @Type(() => BadgeContentDto)
    content: BadgeContentDto;
}
