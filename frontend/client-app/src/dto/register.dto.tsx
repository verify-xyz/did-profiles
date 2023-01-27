export class RegisterServiceDto {
    type: string;
    serviceEndpoint: string;
    ipfsHash: string;

    constructor(type: string, serviceEndpoint: string, ipfsHash: string) {
        this.type = type;
        this.serviceEndpoint = serviceEndpoint;
        this.ipfsHash = ipfsHash;
    }
}

export class RegisterServiceBodyWithAccess {
    did: string;
    signature: string;
    service: RegisterServiceDto;
    access: string;

    constructor(did: string, signature: string, service: RegisterServiceDto, access: string) {
        this.did = did;
        this.signature = signature;
        this.service = service;
        this.access = access;
    }
}
