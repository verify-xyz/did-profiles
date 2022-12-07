import { Injectable } from '@nestjs/common';
import { ProfileDto } from '../dto/badge.dto';
import { LitService } from '../lit/lit.service';
import { of as HashOf } from 'ipfs-only-hash';
import { EncryptedProfileDto } from '../dto/encryptedBadge.dto';

@Injectable()
export class CryptionService {
    /**
     * Constructor - creates cryptionService object
     * @param litService - LitService
     */
    constructor(private litService: LitService) {}

    /**
     * Encrypts ProfileDto. Client signs for Lit.Encryption, gets IPFS.CID. Cabana also signs
     * @param data - ProfileDto (contains signature and content)
     * @returns encrypted string
     */
    async encryptProfile(data: ProfileDto) {
        const account = this.litService.createAuthSig(
            data.authSig.signature,
            data.authSig.address,
            data.authSig.message,
        );
        const rawString = JSON.stringify(data.content);

        //TODO - check for error
        const result = await this.litService.encryptString(account, rawString);
        const content = await this.serializeLitEncrypt(result);

        const contentStr = JSON.stringify({ account, content });

        const contentData = Buffer.from(contentStr);
        const cid = await HashOf(contentData);

        return contentStr;
    }

    /**
     * SerializeLitEncrypt
     * @param param0 - LitEncryptedResult
     * @returns encryptedString & encryptedSymmetricKey
     */
    private async serializeLitEncrypt({ encryptedFile, encryptedSymmetricKey }: LitEncryptedResult) {
        const buffer = await encryptedFile.arrayBuffer();
        const encryptedString = Buffer.from(buffer).toString('base64');
        encryptedSymmetricKey = Buffer.from(encryptedSymmetricKey, 'hex').toString('base64');
        return {
            encryptedString,
            encryptedSymmetricKey,
        };
    }

    /**
     * Decrypts profile
     * @param encryptedProfileDto - encrypted profile DTO
     * @returns content with decrypted string
     */
    async decryptProfile(encryptedProfileDto: EncryptedProfileDto) {
        const { encryptedFile, encryptedSymmetricKey } = this.deserializeLitEncrypt(
            encryptedProfileDto.content.encryptedString,
            encryptedProfileDto.content.encryptedSymmetricKey,
        );
        const decryptedStr = await this.litService.decryptString(
            encryptedProfileDto.account,
            encryptedFile,
            encryptedSymmetricKey,
        );

        return {
            content: JSON.parse(decryptedStr),
        };
    }

    /**
     * Deserialize Lit Encrypt
     * @param encryptedString - encrypted string
     * @param encryptedSymmetricKey - encrypte symetric key
     * @returns encryptedFile & encryptedSymmetricKey
     */
    private deserializeLitEncrypt(encryptedString: string, encryptedSymmetricKey: string) {
        const encryptedFile = new Blob([Buffer.from(encryptedString, 'base64')]);
        encryptedSymmetricKey = Buffer.from(encryptedSymmetricKey, 'base64').toString('hex');
        return {
            encryptedFile,
            encryptedSymmetricKey,
        };
    }
}

type LitEncryptedResult = {
    encryptedFile: Blob;
    encryptedSymmetricKey: string;
};
