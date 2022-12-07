import { Test, TestingModule } from '@nestjs/testing';
import { EncryptedAccountDto, EncryptedContentDto, EncryptedProfileDto } from '../dto/encryptedProfile.dto';
import { AuthSigDto, ProfileContentDto, ProfileDto } from '../dto/profile.dto';
import { LitService } from '../lit/lit.service';
import { CryptionService } from './cryption.service';

const content: ProfileContentDto = {
    template: 'message',
    credentials: 1,
    attributes: { a: '2' },
};

const authSig: AuthSigDto = {
    signature:
        '0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b',
    message: 'I am creating an account to use LITs at 2021-08-04T20:14:04.918Z',
    address: '0xdbd360f30097fb6d938dcc8b7b62854b36160b45',
};

const profileDto: ProfileDto = {
    content: content,
    authSig: authSig,
};

const encryptedAccountDto: EncryptedAccountDto = {
    sig: '0x15517d32074a8c88df9df9a8959c2ff7bd6e2ae47f2badbab6adf028c2e2335a02b52dbc0fb7f412b6ebe3059c75986ee333b367b4ef1566edfe037040f16bd51c',
    derivedVia: '0xB9e2CccDa89C74723badF95484DeD691379AEAae',
    signedMessage: 'I am creating an account to use LIT at 2022-12-07T13:32:29.564Z',
    address: '0xB9e2CccDa89C74723badF95484DeD691379AEAae',
};

const encryptedContentDto: EncryptedContentDto = {
    encryptedString:
        'kJACaIVQzPtj6dbJnhB5s6pcxfJ3iXYMx1nc6yDhsIrbu/N1NfXgELQEbQK11hkvWKLW4qRmXW9oiFV79OUDGcdivzRIHSpMGuMOSKyVGu0=',
    encryptedSymmetricKey:
        'Sm1oaFQYyjvPy2Zu7LzvdJ4gE33AAbZMKhICvK9K+PFf/lAbM3x5HMUxwPLhUG4PQ+l0xuyu3kOs/Obkh1R/+fKHTubFKLZnkfebS9Ta0hBYlPgwO6/63kqQap4zvd+urEhLt9DuKonpDdOfdFlEZ5yoBKu5dEoGblNmcpHOY10AAAAAAAAAIMIH95voFS8kIjz0jk7NCUofxlXBIreDcTkERpgZ1fCM2p+E2fJWgZxFhHkyYVc4lQ==',
};

const encryptedProfileDto: EncryptedProfileDto = {
    content: encryptedContentDto,
    account: encryptedAccountDto,
};

const decryptionResult = {
    template: '111',
    credentials: 1,
    attributes: { a: '2' },
};

describe('CryptionService', () => {
    let service: CryptionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CryptionService, LitService],
        }).compile();

        service = module.get<CryptionService>(CryptionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should provide valid content string', async () => {
        const content = await service.encryptProfile(profileDto);
        expect(content).toContain('I am creating an account to use LIT at');
    }, 20000);

    it('should provide valid content', async () => {
        const result = await service.decryptProfile(encryptedProfileDto);
        expect(result.content).toEqual(decryptionResult);
    }, 20000);
});
