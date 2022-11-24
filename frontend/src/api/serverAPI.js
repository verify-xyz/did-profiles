class ServerAPI {
    static postSendMessageToIpfsServer = (messageJSON) => {
        fetch('/post-send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: messageJSON
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));
    };
}

export default ServerAPI;
