import { useEffect, useState } from "react";
import ServerAPI from '../api/serverAPI';

export default function Publish() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(message);
        setMessage(message);
    });

    async function buttonPublishClickedHandler() {
        const msg = (document.getElementById('messageID') as HTMLInputElement).value;
        console.log(msg);

        const response = await ServerAPI.sendMessageToIPFS(msg);
        console.log(response.hash);
    }

    return (
        <div className='Publish-main-container'>
            <div className='Publish-grid-container01'>
                <label className="Publish-label">Message:</label>
                <input className="Publish-input" id='messageID'></input>
                <div className="Publish-button" id="publishID" onClick={buttonPublishClickedHandler}>Publish</div>
            </div>
        </div>
    );
};