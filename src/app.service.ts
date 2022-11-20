import { Injectable } from '@nestjs/common';
import {ProfileDto} from "./dto/profileDto";
import {LitService} from "./lit/lit.service";
import {StorageService} from "./storage/storage.service";
import {Blob} from "buffer";

@Injectable()
export class AppService {

    constructor(
        private litService: LitService,
        private storageService: StorageService
    ) {
    }

    getHello(): string {
      return 'Hello World!';
    }

    //1. Client signs for Lit.Encryption, gets IPFS.CID
    //   Cabana also signs
    async encryptProfile(data: ProfileDto) {
        const account = this.litService.createAuthSig(data.authSig.signature, data.authSig.address, data.authSig.message);
        const rawString = JSON.stringify(data.content);

        //TODO - check for error
        const result = await this.litService.encryptString(account, rawString);
        const content = await this.serializeLitEncrypt(result);

        const contentStr = JSON.stringify({ account, content })

        console.log('encrypted: ', content);

        // const contentData = Buffer.from(contentStr)
        // const cid = await HashOf(contentData);

        // return { url: cid };

        // const url = await this.storageService.saveToCloud(contentStr, cid);
        const url = await this.storageService.saveToIPFS(contentStr);

        return { url };
    }

    async decryptProfile(cid: string) {
        const contentUrl = `https://cabana-identity-default-rtdb.firebaseio.com/cloud/${cid}.json`;
        const {content, account }: BadgeStorageDto = await this.storageService.getContent(contentUrl);
        const { encryptedFile, encryptedSymmetricKey } = this.deserializeLitEncrypt(content.encryptedString, content.encryptedSymmetricKey)
        const decryptedStr = await this.litService.decryptString(account, encryptedFile, encryptedSymmetricKey);

        console.log('decryptedStr: ', decryptedStr);

        return {
            content: JSON.parse(decryptedStr)
        }
    }

    clientSignUpdate(service: { type: string; serviceEndpoint: string }) {

    }

    private async serializeLitEncrypt({encryptedFile, encryptedSymmetricKey}: LitEncryptedResult) {
        const buffer = await encryptedFile.arrayBuffer();
        const encryptedString = Buffer.from(buffer).toString("base64");
        encryptedSymmetricKey = Buffer.from(encryptedSymmetricKey, 'hex').toString("base64");
        return {
            encryptedString,
            encryptedSymmetricKey
        }
    }

    private deserializeLitEncrypt(encryptedString: string, encryptedSymmetricKey: string) {

        const encryptedFile = new Blob([Buffer.from(encryptedString, "base64")])
        encryptedSymmetricKey = Buffer.from(encryptedSymmetricKey, 'base64').toString("hex");
        return {
            encryptedFile,
            encryptedSymmetricKey
        }
    }
}

type LitEncryptedResult = {
    encryptedFile: Blob,
    encryptedSymmetricKey: string
}

type BadgeStorageDto = {
    account: {
        sig: string,
        address: string,
        message: string,
        derivedVia: string,
        signedMessage: string
    },
    content: {
        encryptedString: string,
        encryptedSymmetricKey: string
    }
}
