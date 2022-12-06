import { Injectable } from '@nestjs/common';
import { BadgeDto } from '../dto/badge.dto';
import { LitService } from '../lit/lit.service';
import { of as HashOf } from 'ipfs-only-hash';

@Injectable()
export class CryptionService {
    /**
     * Constructor - creates cryptionService object
     * @param litService - LitService
     */
    constructor(private litService: LitService) {}

    /**
     * Encrypts BadgeDto. Client signs for Lit.Encryption, gets IPFS.CID. Cabana also signs
     * @param data - BadgeDto (contains signature and content)
     * @returns encrypted string
     */
    async encryptBadge(data: BadgeDto) {
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
}

type LitEncryptedResult = {
    encryptedFile: Blob;
    encryptedSymmetricKey: string;
};
