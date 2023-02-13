<p align="center">
  <a href="https://cabanalabs.com" target="blank"><img src="https://cabanalabs.com/_next/static/media/cabana_logo.7bf4fac6.svg" width="200" alt="Cabana Labs, Inc Logo" /></a>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://cabanalabs.com" target="blank"><img src="https://github.com/verify-xyz/did-profiles/raw/main/assets/verify_logo.png" width="200" alt="Cabana Labs, Inc Logo" /></a>
</p>

# Development Work Milestone #3 - client-side app

## Overview

This milestone includes the "client-side app" implementation. We show how to perform signing from a client side wallet, connecting to MetaMask, creating a Lit Auth signature, publishing content to IPFS and changing the ownership to make the content private for all.  

A NestJS server provides end-points for resolving the DID content, decrypting and fetching the content from IPFS.

A client side app is provided for signing activities.

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

This will generate the variables you need to populate the `backend/.env` and `frontend/client-side/.env` files.

Use https://goerlifaucet.com/ to receive Goerli ETH

### Install and run backend server
```bash
cd backend
npm install
npm run start
```

### Install and run the client app
```bash
cd frontend/client-app
npm install
npm run start
```
### Using the Client App

1. From Wallet tab, click "Connect to MetaMask"
   After successfully connecting, the ethereum address of the account will be shown.
2. Click, "Personal Sign" to open MetaMask and create a signature for Lit protocol
3. Change tabs to "Publish"
4. Enter a message in the text field and click "Publish"
   This single step bundles several actions together: encrypt content, push to IPFS and register state in a smart-contract.

   a. Make sure you are on the Goerli Test network and have test ETH in your wallet. Use https://goerlifaucet.com/ if necessary.

   b. Confirm in MetaMask

   c. Once the transaction has been mined, a link will appear.
5. Change tabs to "Manage"
6. Click "Change ownership". This will update the smart-contract to make the content private for all users.

