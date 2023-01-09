import { InjectedConnector } from '@web3-react/injected-connector'

export const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 6, 42, 61, 63, 212, 2018],
})