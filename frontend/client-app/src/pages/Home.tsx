import { NavLink } from "react-router-dom";

export default function Home() {
    return (
        <div className='Home-main-container'>
            <h2 className='Home-headline'>Simple client application</h2>
            <h3>In order to use this application please install: <a className='Home-link' href="https://metamask.io/download/">MetaMask browser add on</a></h3>
            <h3><NavLink to='wallet' className='Home-nav-link'>Wallet page</NavLink> - allows you to connect/disconnect to MetaMask</h3>
            <h3><NavLink to='publish' className='Home-nav-link'>Publish page</NavLink> - allows you to publish a message</h3>
            <h3><NavLink to='view' className='Home-nav-link'>View page</NavLink> - allows you to change ownership</h3>
        </div>
    );
};

