import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav className='Layout-header'>
                <div className='Layout-menuItem'>
                    <Link to="/">Home</Link>
                </div>
                <div className='Layout-menuItem'>
                    <Link to="/wallet">Wallet</Link>
                </div>
                <div className='Layout-menuItem'>
                    <Link to="/publish">Publish</Link>
                </div>
                <div className='Layout-menuItem'>
                    <Link to="/manage">Manage</Link>
                </div>
            </nav>

            <Outlet />
        </>
    )
};

export default Layout;