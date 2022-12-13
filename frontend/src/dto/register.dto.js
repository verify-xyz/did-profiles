export class RegisterServiceDto {
    constructor(type, serviceEndpoint, ipfsHash) {
        this.type = type;
        this.serviceEndpoint = serviceEndpoint;
        this.ipfsHash = ipfsHash;
    }
}

export class ClientSignatureBody {
    constructor(network, service) {
        this.network = network;
        this.service = service;
    }
}

export class RegisterServiceBody {
    constructor(did, signature, service) {
        this.did = did;
        this.signature = signature;
        this.service = service;
    }
}
