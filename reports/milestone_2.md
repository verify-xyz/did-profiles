<p align="center">
  <a href="https://cabanalabs.com" target="blank"><img src="https://cabanalabs.com/_next/static/media/cabana_logo.7bf4fac6.svg" width="200" alt="Cabana Labs, Inc Logo" /></a>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://cabanalabs.com" target="blank"><img src="https://github.com/verify-xyz/did-profiles/raw/main/assets/verify_logo.png" width="200" alt="Cabana Labs, Inc Logo" /></a>
</p>

# Development Work Milestone #2 - DID-Resolve

## Overview

This milestone includes the "DID-Resolve" implementation. We show how to resolve a did document, extract the registered IPFS content, fetch the IPFS content, decrypt and then display the original content.
A NestJS server provides end-points for resolving the DID content, decrypting and fetching the content from IPFS.
A client side app is provided to test the features.

## Setting up the ENV

### IPFS server

Follow the instructions in the [readme.md](https://github.com/verify-xyz/did-profiles/tree/dev/ipfs#readme) to run the IPFS daemon.

### Setup .ENV variable

You can use a script to generate random accounts to use for both client and server
```bash
cd backend
npm install
npx ts-node utils/create-accounts.ts
```

This will generate the variables you need to populate the `backend/.env` and `frontend/.env` files.

Use https://goerlifaucet.com/ to receive Goerli ETH

### Install and run backend server
```bash
cd backend
npm install
npm run start
```

### Install and run the frontend client
```bash
cd frontend
npm install
npm run start
```
### Using the Testing App


<img src="https://github.com/verify-xyz/did-profiles/raw/dev/reports/images/testing_app_2.png" width="600" alt="Cabana Labs, Inc Logo" /></a>


### Step #4 - Resolve

Enter the DID of the client account. Click "Resolve" to fetch state information from the smart contract and get a DID document back with the service endPoint. 

The serviceEndPoint will be the URL to the IPFS location of the decrypted content. Click "Fetch" to retrieve and decrypt.

The final input field will show the original content message.

### Step #5 - Update access permissions

Choose to make the access to the content available to all (public) or available to no one (private)

Click "Client Signature" to generate the a signature using the Client account. 

Click "Write" to send the request to the server which will relay and pay for the smart contract state change. 

### Attempt Step #4 again 

Now that the access permission is set to private, try to "Fetch" the encrypted content again in Step #4. The response will be 

`Profile is set to private. Unable to decrypt.`

Changing the permissions back to public again, will allow the content to be decrypted.


## Next steps

In the next phase, the combine steps of "DID-Publish" and "DID-Resolve" will be utilized in a client-side app to show how projects can use this to create and manage decentralized profiles. 

