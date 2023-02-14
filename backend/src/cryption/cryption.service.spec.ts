import { Test, TestingModule } from '@nestjs/testing';
import { EncryptedAccountDto, EncryptedContentDto, EncryptedProfileDto } from '../dto/encryptedProfile.dto';
import { AuthSigDto, ProfileContentDto, ProfileDto } from '../dto/profile.dto';
import { LitService } from '../lit/lit.service';
import { CryptionService } from './cryption.service';

const content: ProfileContentDto = {
    template: '111',
    credentials: 1,
    attributes: { a: '2' },
};

const authSig: AuthSigDto = {
    sig: '0x18a173d68d2f78cc5c13da0dfe36eec2a293285bee6d42547b9577bf26cdc985660ed3dddc4e75d422366cac07e8a9fc77669b10373bef9c7b8e4280252dfddf1b',
    signedMessage: 'I am creating an account to use LITs at 2021-08-04T20:14:04.918Z',
    address: '0xdbd360f30097fb6d938dcc8b7b62854b36160b45',
    derivedVia: 'web3.eth.personal.sign',
};

const profileDto: ProfileDto = {
    content: content,
    authSig: authSig,
};

const encryptedAccountDto: EncryptedAccountDto = {
    sig: '0x686b095a9d51456d3ea798140cf38645bc106c071e4f83bec539ad6a1e65773d57474b3075827f296cce0f7ba582d7acb929e0891411c6e17af78891c4caf8c11b',
    derivedVia: 'web3.eth.personal.sign',
    signedMessage: 'I am creating an account to use LIT at 2022-12-13T09:04:20.628Z',
    address: '0x7405cB310289DC8BBd2b4BE4A16DAA2882c57c74',
};

const encryptedContentDto: EncryptedContentDto = {
    encryptedString:
        'UQcBg5Ghx6Qs6tVTgPTJv9P1Sg9W0BglyIN2CPbL7KHisNJjKJ9aeJSB8TR0zyWPYVDR35N6fe0WnX3XFLlSFlg0303c8faKulVK041oNvs=',
    encryptedSymmetricKey:
        'fHsaPuUHf/g72pMBtiyqa1uLkMtLfC7aEV7b+qHdw5iBPoCUAEm3ZcXh3xJWbvQU55MFn4soDulWCFqvdoNTWKcG+Yn5oXn9+mB1LHqsRtcFqj47hXtn+eSZ2SSqlXmhY+tizlSZlozu9zN5rCtuau3k5aE4CSn4vaotyhfqlMgAAAAAAAAAICEi/swirMobuZUH3DBE55Fkb3fgmxNJZiZ6oyUEpYwCO+xmmsrYf4YbjWKla6hrkw==',
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
        const content = await service.encryptProfile(profileDto.content, encryptedAccountDto);
        expect(content).toContain('I am creating an account to use LIT at');
    }, 20000);

    it('should provide valid content', async () => {
        const result = await service.decryptProfile(encryptedProfileDto);
        expect(result.content).toEqual(decryptionResult);
    }, 20000);
});
