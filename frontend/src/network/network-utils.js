import { BigNumber } from '@ethersproject/bignumber';
// import {Provider} from "@ethersproject/abstract-provider";
import { JsonRpcProvider } from '@ethersproject/providers';

export class EthrNetworkConfiguration {
    constructor(chainId, name, provider, rpcUrl) {
        this.chainId = chainId;
        this.name = name;
        this.provider = provider;
        this.rpcurl = rpcUrl;
    }
}

export class NetworkUtils {
    network1 = new EthrNetworkConfiguration(null, 'mainnet', null, 'https://mainnet.infura.io/v3/' + process.env.INFURA_NETWORK_ID);
    network2 = new EthrNetworkConfiguration(null, 'goerli', null, 'https://goerli.infura.io/v3/' + process.env.INFURA_NETWORK_ID);
    networks = [this.network1, this.network2];

    constructor() {
        if (!process.env.REACT_APP_INFURA_NETWORK_ID) {
            throw new Error('Missing env - INFURA_NETWORK_ID');
        }
    }

    getNetworkFor(networkSpecifier) {
        let networkNameOrId = networkSpecifier || 'mainnet';
        if (
            typeof networkNameOrId === 'string' &&
            (networkNameOrId.startsWith('0x') || parseInt(networkNameOrId) > 0)
        ) {
            networkNameOrId = BigNumber.from(networkNameOrId).toNumber();
        }
        let network = this.networks.find(n => n.chainId === networkNameOrId || n.name === networkNameOrId);
        if (!network && !networkSpecifier && this.networks.length === 1) {
            network = this.networks[0];
        }
        return network;
    }

    getNetworkProviderFor(network) {
        const networkConfig = this.getNetworkFor(network);

        let provider = networkConfig.provider;

        if (!provider) {
            provider = new JsonRpcProvider(networkConfig.rpcUrl, networkConfig.name);
        }

        return provider;
    };
}
