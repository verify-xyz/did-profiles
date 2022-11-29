import { Injectable } from '@nestjs/common';
import shell from 'shelljs';
//import IPFS from 'ipfs-mini';
import { create } from 'ipfs-http-client';
//import { create } from 'ipfs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class IpfsApiService {
    //constructor(/*private shell2: shell*/) {}
    constructor(private readonly httpService: HttpService) {}

    async runBatch(something1: string, something2: string) {
        // run batch file here
        console.log('Run batch');
        //const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        //await ipfs.add('hello world!').then(console.log).catch(console.log);

        shell.echo('shell echo tralalalal');
        // shell.mkdir('labada');

        // await shell.exec('./hi.sh', { async: true });

        /* const client = create();
        const added = await client.add('hello world from react app');
        const hash = `hash: ${added.path}`;
        console.log(hash); */

        /* const { cid } = await client.add('Hello world!');
        console.log(cid); */

        //const ipfs = await create();
        //ipfs.add('Hello world!');

        /* Create an instance of the client */
        /* const client = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
        });

        const added = await client.add('hello world'); */
    }

    async addStringToIpfs(text: string) {
        const url = 'http://localhost:8080/ipfs/add';
        const data = text; //'tralalalalalala'; //{ resend: true };

        const response = await this.httpService.post(url, data).toPromise();
        const headers = response.headers;
        const hash = headers['ipfs-hash'];
        return hash;
    }
}
