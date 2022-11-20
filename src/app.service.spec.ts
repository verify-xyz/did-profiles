import { Test, TestingModule } from '@nestjs/testing';
import {AppService} from "./app.service";
import {LitService} from "./lit/lit.service";
import {StorageService} from "./storage/storage.service";
import {of as HashOf} from 'ipfs-only-hash'

const user = {
  signature: '0xfc467d442d3cf8f96228e4c950b51cdd2a90649343d69e6b838983e75ba241872171b3a92d5f5e12945621d59a924d5c26dca23d458e3cc7ae06f3edfef9f7291c',
  address: '0x939D7d1F84bF96100aD52ae6fE4195Cb38cE3bC8'
}

process.env = {
  CLOUD_SERVER: 'http://localhost:5005/cabana-identity/us-central1/org'
}

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        LitService,
        StorageService
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });


  it('should calculate the IPFS hash of a buffer', async () => {
    const body = {
      "template": "cabana-profile",
      "credentials": {
        "a": 1
      },
      "attributes": {
        "a": 1
      }
    };

    const data = Buffer.from(JSON.stringify(body,null,2))
    console.log(HashOf)
    const hash = await HashOf(data)
    console.log('hash', hash)
    expect(hash).toBe('QmcYGhqKc8LgXo6WTZbbNJtTR6yqEM9grorepv8HxkMtL4')
  }, 15000);

});
