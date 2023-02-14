<p align="center">
  <a href="https://cabanalabs.com" target="blank"><img src="https://cabanalabs.com/_next/static/media/cabana_logo.7bf4fac6.svg" width="200" alt="Cabana Labs, Inc Logo" /></a>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
  <a href="https://cabanalabs.com" target="blank"><img src="https://github.com/verify-xyz/did-profiles/raw/main/assets/verify_logo.png" width="200" alt="Cabana Labs, Inc Logo" /></a>
</p>

# Development Work Milestone #1 - DID-Publish

## Overview

This milestone includes the DID-Publish phase. User content is entered, encrypted, stored on IPFS and registered in a DID address on the ethr-did-registry smart contract.
 A NestJS server provides end-points for receiving content, encrypting and coordinating signing and register.
A client side app is provided to test the features.

## Setting up the ENV

### IPFS server

Follow the instructions in the [readme.md](https://github.com/verify-xyz/did-profiles/tree/dev/ipfs#readme) to run the daemon.

### Backend
```bash
cd backend
npm install
npm run start
```

### Frontend
```bash
cd frontend
npm install
npm run start
```
### Using the Testing App


<img src="https://github.com/verify-xyz/did-profiles/raw/dev/reports/images/testing_app_1.png" width="600" alt="Cabana Labs, Inc Logo" /></a>


### Step #1

Send any message to be encrypted and posted to the local IPFS server

After seeing the IPFS hash in step2 be populated, you can check the IPFS content by command line

For example
```bash
curl http://localhost:8080/ipfs/QmZdmJigMEqPqW3pBJHFQAoN8KYjgg5wh4tzbVCwLxXRXR
```
The response will be the encrypted content saved to IPFS

Example
```json
{
  "account": {
    "sig": "0xfdc2e00f7bb6aa91a312598cf9fb3e3bbdf89700a0041706eb89a11ba3212dae172ff85a2e824e3dfb83b36494cca11747a7d5f0899fc66c2964bc2db9cdfacb1b",
    "derivedVia": "0x3074b7445C8C2CC1f43DF763f254be8a478257cB",
    "signedMessage": "I am creating an account to use LIT at 2022-12-14T20:49:17.007Z",
    "address": "0x3074b7445C8C2CC1f43DF763f254be8a478257cB"
  },
  "content": {
    "encryptedString": "XGbE2mvQq+AWGO4XKWbbWFWVVkWwmFbd7a4OTfuYV/n5sUaP9zvdclzot8FHfi0Oa32wsjJJ8t5qNgqCMi6UfcEqFl60IR25utmKT5CorGY2Qh3NZ/8ckssti+YBShE9",
    "encryptedSymmetricKey": "+xocviLFNWP6hODpi8aD6oPgY4ialGdciLijrChpBXMRv9Sh1LqcgO+LlElG5DoSZB22g6IyziZn9NP7OdeYku/0Mud4fE8kNqpH6s/708aC+ych09pNladAxiEz73+lFmdxVaj7YiY2tIXAyr3o9fU6vhmI+WJW6ENMRadtCDsAAAAAAAAAIEB98uLO1C/4jgOZCPIEAEYEt32SPnK3L/nAObx9Wz9KPrkzHhsoRIF7NSKEhrgOkQ=="
  }
}
```


### Step #2

Request the content from IPFS and decrypt. The message will be decrypted and the same as the original one sent in Step 1.

### Step #3

Click "Client Signature" to sign the register transaction using the client key defined in `.env` file

Click "Register" to initiate a smart-contract call to write the IPFS hash to the DID address of the ethr-did-registry.

## Next steps

In the next phase, "DID-Resolve", we will show how we can resolve a did document from this address, extract the IPFS content registered, fetch the IPFS content, decrypt and then render the content. The combine steps of "DID-Publish" and "DID-Resolve" will then be utilized in a client-side app to show how projects can use this to create and manage decentralized profiles. 

