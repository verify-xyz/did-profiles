import {Wallet} from "ethers";
import {verifyMessage} from "@ethersproject/wallet";
import {joinSignature} from "@ethersproject/bytes";
import {hashMessage} from "@ethersproject/hash";

let clientWallet = Wallet.createRandom();
let serverWallet = Wallet.createRandom();

const message = 'I am creating an account to use LIT at ' + new Date().toISOString()
const signature = joinSignature(clientWallet._signingKey().signDigest(hashMessage(message)));

console.log('\n =============== SERVER ENV ===============')
console.log('INFURA_NETWORK_ID=eee90ba565f04be7880a63ee41082f17');
console.log('SERVER_PRIVATE_KEY=' + serverWallet.privateKey.slice(2))
console.log('SERVER_ADDRESS=' + serverWallet.address);
console.log('CLIENT_PRIVATE_KEY=' + clientWallet.privateKey.slice(2))
console.log('CLIENT_ADDRESS=' + clientWallet.address);

console.log('\n =============== CLIENT ENV ===============')
console.log('INFURA_NETWORK_ID=eee90ba565f04be7880a63ee41082f17');
console.log('REACT_APP_SERVER_ADDRESS=' + serverWallet.address);
console.log('REACT_APP_CLIENT_PRIVATE_KEY=' + clientWallet.privateKey.slice(2))
console.log('REACT_APP_CLIENT_ADDRESS=' + clientWallet.address);
console.log('REACT_APP_CLIENT_AUTH_SIG=' + JSON.stringify({ sig: signature, address: clientWallet.address, signedMessage: message, derivedVia: 'web3.eth.personal.sign' }));

const recoverAddress = verifyMessage(message, signature);

console.log('\nVerify public key can be recovered from signature =', (clientWallet.address === recoverAddress));

console.log()
