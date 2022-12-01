import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpfsApiService {
    private readonly ipfsUrlAdd: string;
    private readonly ipfsUrlRead: string;

    /**
     * Constructor - constructs IpfsApiService object
     * @param httpService - HttpService object
     * @param configService - ConfigService object
     */
    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
        this.ipfsUrlAdd = this.configService.get('IPFS_URL_ADD');
        this.ipfsUrlRead = this.configService.get('IPFS_URL_READ');
    }

    /**
     * Adds string into IPFS
     * @param text - string to be added into IPFS
     * @returns - hash code of the string added into IPFS
     */
    async addStringToIpfs(text: string) {
        const url = this.ipfsUrlAdd;
        const data = text;

        const response = await this.httpService.post(url, data).toPromise();
        const headers = response.headers;
        const hash = headers['ipfs-hash'];

        return hash;
    }

    /**
     * Gets string from IPFS
     * @param hash - ipfs hash code of the string previously added into IPFS
     * @returns - the string witch is related to the provided ipfs hash code
     */
    async getStringFromIpfs(hash: string) {
        const url = `${this.ipfsUrlRead}/${hash}`;

        const response = await this.httpService.get(url).toPromise();
        const text = response.data;

        return text;
    }
}
