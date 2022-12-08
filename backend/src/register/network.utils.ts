import { BigNumber } from '@ethersproject/bignumber';
import { Provider } from '@ethersproject/abstract-provider';
import { JsonRpcProvider } from '@ethersproject/providers';

export interface EthrNetworkConfiguration {
    chainId?: string | number;
    name?: string;
    provider?: Provider;
    rpcUrl?: string;

    // The EIP1056 registry address for the ethereum network being configured.
    // https://github.com/uport-project/ethr-did-registry#contract-deployments
    registry?: string;
}

export class NetworkUtils {
    private readonly networks: EthrNetworkConfiguration[] = [
        {
            name: 'mainnet',
            rpcUrl: 'https://mainnet.infura.io/v3/' + process.env.INFURA_NETWORK_ID,
        },
        {
            name: 'goerli',
            rpcUrl: 'https://goerli.infura.io/v3/' + process.env.INFURA_NETWORK_ID,
        },
    ];

    constructor() {
        if (!process.env.INFURA_NETWORK_ID) {
            throw new Error('Missing env - INFURA_NETWORK_ID');
        }
    }

    getNetworkFor(networkSpecifier: string | number | undefined): EthrNetworkConfiguration | undefined {
        let networkNameOrId: string | number = networkSpecifier || 'mainnet';
        if (
            typeof networkNameOrId === 'string' &&
            (networkNameOrId.startsWith('0x') || parseInt(networkNameOrId) > 0)
        ) {
            networkNameOrId = BigNumber.from(networkNameOrId).toNumber();
        }
        let network = this.networks.find((n) => n.chainId === networkNameOrId || n.name === networkNameOrId);
        if (!network && !networkSpecifier && this.networks.length === 1) {
            network = this.networks[0];
        }
        return network;
    }

    getNetworkProviderFor(network: string) {
        const networkConfig = this.getNetworkFor(network);

        let provider = networkConfig.provider;

        if (!provider) {
            provider = new JsonRpcProvider(networkConfig.rpcUrl, networkConfig.name);
        }

        return provider;
    }
}
