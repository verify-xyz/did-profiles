class ServerAPI {
    static async sendMessageToIPFS (message) {
        const response = await fetch('/ipfs/add/' + message);
        return await response.json();
    }

    static async getMessageFromIPFS (hash) {
        const response = await fetch('/ipfs/read/' + hash);
        return await response.json();
    }

    /* static async postGetMessageFromIPFS (address) {
        await fetch('/get-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: address
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }; */
}

export default ServerAPI;
