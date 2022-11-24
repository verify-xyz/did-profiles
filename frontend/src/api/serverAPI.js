class ServerAPI {
    static postSendMessageToIpfsServer = (messageJSON) => {
        fetch('/backend/post-split-percents', {
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
