import { Injectable } from '@nestjs/common';
import { create as createIpfsClient } from "ipfs-http-client";
const fetch = require('node-fetch');

@Injectable()
export class StorageService {
    private ipfsAuth: string;

    constructor() {

    }

    private getInfuraApiKey() {
        if (!process.env.INFURA_IPFS_API_KEY) {
            throw new Error('Missing env - INFURA_IPFS_API_KEY');
        }
        return process.env.INFURA_IPFS_API_KEY;
    }

    private getIpfsAuth() {
        if (!this.ipfsAuth) {
            const API_KEY = this.getInfuraApiKey();
            this.ipfsAuth = 'Basic ' + Buffer.from(API_KEY).toString('base64');
            console.log('getIpfsAuth', API_KEY, this.ipfsAuth)
        }
        return this.ipfsAuth;
    }

    async saveToIPFS(body: any) {

        const client = createIpfsClient({
            url: process.env.INFURA_IPFS_URL,
            headers: {
                Authorization: this.getIpfsAuth(),
            },
        });

        const created = await client.add(JSON.stringify(body,null,2));
        const url = `https://infura-ipfs.io/ipfs/${created.path}`;

        return url;
    }

    async getContent(url: string) {

        const headers = {
            'Content-Type': 'application/json'
        };

        const res = await fetch(url, { headers });

        if (res.status < 200 || res.status > 299) {
            const error = await res.text();
            throw new Error(error);
        }

        return res.json();
    }
}
