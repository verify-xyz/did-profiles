import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class EncryptedAccountDto {
    @IsString()
    sig: string;

    @IsString()
    derivedVia: string;

    @IsString()
    signedMessage: string;

    @IsString()
    address: string;
}

export class EncryptedContentDto {
    @IsString()
    encryptedString: string;

    @IsString()
    encryptedSymmetricKey: string;
}

export class EncryptedBadgeDto {
    @IsDefined()
    @ValidateNested()
    @Type(() => EncryptedAccountDto)
    account: EncryptedAccountDto;

    @IsDefined()
    @ValidateNested()
    @Type(() => EncryptedContentDto)
    content: EncryptedContentDto;
}
