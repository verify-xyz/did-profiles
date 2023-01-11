class ServerAPI {
    /**
     * Sends message to IPFS
     * @param {string} message - Message that should be added to IPFS
     * @returns Hash code of the message added to IPFS
     */
    static async sendMessageToIPFS(message) {
        console.log('message: ' + message);
        // const date = new Date();

        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                content: message,
                authSig: {
                    address: '0xB8809F1FbD3682f2a2b45d6dd7379962f4ffaB96', // process.env.REACT_APP_CLIENT_ADDRESS,
                    sig: '0x0d7e7c3e2207c4d086343673b2caca1a6fd6cf8bc1310ae16aca2b85b35d9828469769fcddd09b4ea568d1edd3b991f5c176fae6b8944159d0419329f2affa771c', // process.env.REACT_APP_CLIENT_AUTH_SIG,
                    signedMessage: 'I am creating an account to use LIT at 2023-01-11T12:48:17.069Z', // `I am creating an account to use LIT at ${date}`,
                    derivedVia: 'web3.eth.personal.sign'
                }
            })
        });
        return await response.json();
    }

    /**
     * Gets the message from IPFS
     * @param {string} hash - Hash code of the message previously added to IPFS
     * @returns String related to the hash code
     */
    static async getMessageFromIPFS(hash) {
        const response = await fetch('/read/' + hash);
        if (response.ok) return (await response.json()).text;
        return (await response.json()).message;
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
        const response = await fetch('/register/access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: bodyJSON
        });

        if (response.ok) return response.json();

        return (await response.json()).message;
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
