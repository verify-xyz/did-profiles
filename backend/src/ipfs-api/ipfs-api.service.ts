import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IpfsApiService {
    /**
     * Constructor - constructs IpfsApiService object
     * @param httpService - HttpService object
     */
    constructor(private readonly httpService: HttpService) {}

    /**
     * Adds string into IPFS
     * @param text - string to be assed into IPFS
     * @returns - hash code of the string added into IPFS
     */
    async addStringToIpfs(text: string) {
        const url = 'http://localhost:8080/ipfs/add';
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
        // Get string from IPFS, which is related to the provided ipfs hash code
        const url: string = 'http://127.0.0.1:8080/ipfs/' + hash;
        console.log(url);
        // const url = 'http://localhost:8080/ipfs/QmYhcrdNtC8RmVrvq41YXVQqzHN7SrtYoctQqirwGcForB';

        console.log('http get');
        const response = await this.httpService.get(url).toPromise();
        console.log('http get finished');
        console.log(response.data);
        const text = response.data;
        return text;
    }

    getStringFromIpfsObservable(hash: string) {
        const url = 'http://localhost:8080/ipfs/QmYhcrdNtC8RmVrvq41YXVQqzHN7SrtYoctQqirwGcForB';
        const response = this.httpService.get(url);
        console.log(response);
        return response;
    }
}
