class ServerAPI {
    /**
     * Sends message to IPFS
     * @param {string} message - Message that should be added to IPFS
     * @returns Hash code of the message added to IPFS
     */
    static async sendMessageToIPFS(message) {
        const response = await fetch('/add/' + message);
        return await response.json();
    }

    /**
     * Gets the message from IPFS
     * @param {string} hash - Hash code of the message previously added to IPFS
     * @returns String related to the hash code
     */
    static async getMessageFromIPFS(hash) {
        const response = await fetch('/read/' + hash);
        return await response.json();
    }

    /* @Post('client/signature')
    clientSignUpdate(@Body() body: ClientSignatureBody) {
        console.log('client/signature', body);
        return this.clientSignService.createSignatureAddService(body.network, body.service);
    */

    // static async postClientSignature
    /* static async postClientSignature(bodyJSON) {
        console.log('post client signature');
        fetch('/client/signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        })
            .then(response => {
                console.log('Response----');
                console.log(response);
            })
            .catch(error => console.log(error));
    }; */

    static async postClientSignature(bodyJSON) {
        console.log('post client signature');
        const rawResponse = await fetch('/client/signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        });

        console.log('rawResponse');
        const a = rawResponse;
        console.log(a);

        const content = await rawResponse.json();
        console.log('aaaaa');
        console.log(content);
        console.log('aaaaa');

        return content;
    };
}

export default ServerAPI;
