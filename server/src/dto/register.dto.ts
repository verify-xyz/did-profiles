import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterServiceDto {
    @IsString()
    type: string;

    @IsString()
    serviceEndpoint: string;

    @IsString()
    ipfsHash: string;
}

export class RegisterDto {
    @IsString()
    did: any;

    @IsString()
    signature: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => RegisterServiceDto)
    service: RegisterServiceDto;
}

export class RegisterDtoWithAccess {
    @IsString()
    did: any;

    @IsString()
    signature: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => RegisterServiceDto)
    service: RegisterServiceDto;

    @IsString()
    access: string;
}

export class ClientSignatureBody {
    @IsString()
    network: string;

    @IsDefined()
    @ValidateNested()
    @Type(() => RegisterServiceDto)
    service: RegisterServiceDto;
}
