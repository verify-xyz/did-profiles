import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider } from '@ethersproject/providers';

export class EthrNetworkConfiguration {
    /**
     * Constructs EthrNetworkConfiguration object
     * @param {id} chainId - chain ID
     * @param {string} name - name
     * @param {provider} provider - provider
     * @param {string} rpcUrl - RPC URL
     * @param {registry} registry - registry
     */
    constructor(chainId, name, provider, rpcUrl, registry) {
        this.chainId = chainId;
        this.name = name;
        this.provider = provider;
        this.rpcUrl = rpcUrl;
        this.registry = registry;
    }
}

export class NetworkUtils {
    network1 = new EthrNetworkConfiguration(null, 'mainnet', null, 'https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_NETWORK_ID, null);
    network2 = new EthrNetworkConfiguration(null, 'goerli', null, 'https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_NETWORK_ID, null);
    networks = [this.network1, this.network2];

    /**
     * Constructs NetworkUtils object
     */
    constructor() {
        if (!process.env.REACT_APP_INFURA_NETWORK_ID) {
            throw new Error('Missing env - REACT_APP_INFURA_NETWORK_ID');
        }
    }

    /**
     * Gets network
     * @param {network} networkSpecifier - network specifier
     * @returns network
     */
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

    /**
     * Gets network provider
     * @param {network} network - network
     * @returns network provider
     */
    getNetworkProviderFor(network) {
        const networkConfig = this.getNetworkFor(network);

        let provider = networkConfig.provider;

        if (!provider) {
            provider = new JsonRpcProvider(networkConfig.rpcUrl, networkConfig.name);
        }

        return provider;
    };
}
