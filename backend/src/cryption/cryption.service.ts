import { Injectable } from '@nestjs/common';
import { BadgeDto } from '../dto/badge.dto';
import { LitService } from '../lit/lit.service';
import { of as HashOf } from 'ipfs-only-hash';

@Injectable()
export class CryptionService {
    constructor(private litService: LitService /*, private storageService: StorageService*/) {}

    //1. Client signs for Lit.Encryption, gets IPFS.CID
    //   Cabana also signs
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

        console.log('-------------------------------------------------------------');
        console.log('encrypted: ', content);

        const contentData = Buffer.from(contentStr);
        const cid = await HashOf(contentData);

        // return { url: cid };

        // SAVE TO LOCAL IPFS INSTEAD OF INFURA
        // const url = await this.storageService.saveToCloud(contentStr, cid);
        // const url = await this.storageService.saveToIPFS(contentStr);
        const url = '';

        return { url };
    }

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
