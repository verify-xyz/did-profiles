export class RegisterServiceDto {
    constructor(type, serviceEndpoint) {
        this.type = type;
        this.serviceEndpoint = serviceEndpoint;
    }
}

export class ClientSignatureBody {
    constructor(network, service) {
        this.network = network;
        this.service = service;
    }
}
