import {Injectable} from '@nestjs/common';
import {create as createIpfs, IPFS} from 'ipfs-core'
import { concat, toString } from 'uint8arrays'

@Injectable()
export class IpfsApiService {

    private ipfs: IPFS;

    async getIpfs() {
        if (!this.ipfs) {
            this.ipfs = await createIpfs();
        }
        return this.ipfs;
    }

    /**
     * Adds string into IPFS
     * @param text - string to be added into IPFS
     * @returns - hash code of the string added into IPFS
     */
    async addStringToIpfs(text: string) {

        const ipfs = await this.getIpfs();
        const { cid, path } = await ipfs.add(text);

        console.log('Added file:', path)

        return cid.toString();
    }

    /**
     * Gets string from IPFS
     * @param hash - ipfs hash code of the string previously added into IPFS
     * @returns - the string that is related to the provided ipfs hash code
     */
    async getStringFromIpfs(hash: string) {
        const ipfs = await this.getIpfs();
        const source = ipfs.cat(hash);

        const arr = [];
        for await (const entry of source) arr.push(entry);

        const data = concat(arr)
        const content = toString(data);

        console.log('get file contents:', content);

        try {
            return JSON.parse(content);
        }
        catch(e) {
            return content;
        }
    }

    async shutdown() {
        console.log('shutdown');
        if (this.ipfs) {
            await this.ipfs.stop();
        }
    }
}
