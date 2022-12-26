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

    /**
     * Posts client signature
     * @param {string} bodyJSON JSON body of the POST request
     * @returns client signature
     */
    static async postClientSignature(bodyJSON) {
        const rawResponse = await fetch('/client/signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        });

        const content = await rawResponse.json();

        return content;
    };

    /**
     * Posts register service
     * @param {string} bodyJSON JSON body of the POST request
     * @returns register hash
     */
    static async postRegisterService(bodyJSON) {
        const rawResponse = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        });

        const content = await rawResponse.json();
        console.log(content);

        return content;
    };

    /**
     * Posts register service
     * @param {string} bodyJSON JSON body of the POST request
     * @returns register hash
     */
    static async postRegisterServiceWithAccess(bodyJSON) {
        const rawResponse = await fetch('/register/access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        });

        const content = await rawResponse.json();
        console.log(content);

        return content;
    };

    /**
     * Gets the message from IPFS
     * @param {string} hash - Hash code of the message previously added to IPFS
     * @returns String related to the hash code
     */
    static async getResolve(url) {
        const response = await fetch('/resolve/' + url);
        return await response.json();
    };
}

export default ServerAPI;
