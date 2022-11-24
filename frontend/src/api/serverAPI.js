class ServerAPI {
    static postSendMessageToIPFS = (message) => {
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: message
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };

    static async postGetMessageFromIPFS (address) {
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
    };

    static async getHello () {
        const response = await fetch('/hello');
        return await response.json();
    }
}

export default ServerAPI;
