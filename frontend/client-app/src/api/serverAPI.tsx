import {LitAuthSig} from "../hooks/useLitAuthSig";

class ServerAPI {
    /**
     * Sends message to IPFS
     * @param {string} message - Message that should be added to IPFS
     * @returns Hash code of the message added to IPFS
     */
    static async sendMessageToIPFS(authSig: LitAuthSig, message: string) {
        // const authSig: string = process.env.REACT_APP_CLIENT_AUTH_SIG ?? '';


        console.log('authSig--------------------------------------------');
        console.log(authSig);

        const response = await fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                content: message,
                authSig: authSig
            })
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log('Sending message to IPFS resulted in an error');
            throw new Error((await response.json()).message);
        }
    }

    /**
     * Gets the message from IPFS
     * @param {string} hash - Hash code of the message previously added to IPFS
     * @returns String related to the hash code
     */
    static async getMessageFromIPFS(hash: string) {
        const response = await fetch('/read/' + hash);
        if (response.ok) return (await response.json()).text;
        return (await response.json()).message;
    }

    /**
     * Posts client signature
     * @param {string} bodyJSON JSON body of the POST request
     * @returns client signature
     */
    static async postClientSignature(bodyJSON: string) {
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
    static async postRegisterService(bodyJSON: string) {
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
    static async postRegisterServiceWithAccess(bodyJSON: string) {
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
    static async getResolve(url: string) {
        const response = await fetch('/resolve/' + url);
        return await response.json();
    };
}

export default ServerAPI;
