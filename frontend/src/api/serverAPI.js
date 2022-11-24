class ServerAPI {
    static postSendMessageToIpfsServer = (message) => {
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: message
        });
    };

    static async getHello () {
        const response = await fetch('/hello');
        return await response.json();
    }
}

export default ServerAPI;
