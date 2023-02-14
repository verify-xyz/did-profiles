

<p align="center">
  <a href="https://cabanalabs.com" target="blank"><img src="https://cabanalabs.com/_next/static/media/cabana_logo.7bf4fac6.svg" width="200" alt="Cabana Labs, Inc Logo" /></a>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://cabanalabs.com" target="blank"><img src="https://github.com/verify-xyz/did-profiles/raw/main/assets/verify_logo.png" width="200" alt="Cabana Labs, Inc Logo" /></a>
</p>


## System Design

<p align="center">
  <img src="https://github.com/verify-xyz/did-profiles/raw/main/assets/schematic.png" width="900" alt="Cabana Labs, Inc Logo" />
</p>

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

This will generate the variables you need to populate the 
1. BACKEND: `backend/.env`
2. FRONTEND: `frontend/testing-app/.env` and `frontend/client-side/.env`  files.

Use https://goerlifaucet.com/ to receive Goerli ETH

### Install and run backend server
```bash
cd backend
npm install
npm run start
```

### Install and run the testing app
```bash
cd frontend/testing-app
npm install
npm run start
```

[See walkthrough Part 1 - DID-Publish](https://github.com/verify-xyz/did-profiles/blob/main/reports/milestone_1.md)

[See walkthrough Part 2 - DID-Resolve](https://github.com/verify-xyz/did-profiles/blob/main/reports/milestone_2.md)

### Install and run the client app

```bash
cd frontend/client-app
npm install
npm run start
```

[See walkthrough Part 3 - Client App](https://github.com/verify-xyz/did-profiles/blob/main/reports/milestone_3.md)

## Support and License

Verify XYZ - DID Profiles is an [Apache licensed](LICENSE) open source project from [Cabana Labs, Inc](https://cabanalabs.com).
