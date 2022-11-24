class ServerAPI {
    static postSendMessageToIpfsServer = (message) => {
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

    static async getHello () {
        const response = await fetch('/hello');
        const res = await response.json();
        console.log(res.message);
        // return await response.json();
    }
}

export default ServerAPI;
