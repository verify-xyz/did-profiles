import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Wallet from "./pages/Wallet";
import Publish from "./pages/Publish";
import View from "./pages/View";

function getLibrary(provider: any): Web3 {
    console.log('provider ' + provider);
    return new Web3(provider)
}

export default function App() {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="wallet" element={<Wallet />} />
                        <Route path="publish" element={<Publish />} />
                        <Route path="view" element={<View />} />
                        <Route path="*" element={<NoPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Web3ReactProvider>
    );
}