# IPFS MANUAL

This document describes how to install and set up IPFS server locally.
It also describes how to add and read an arbitrary string using Postman.

## Installation
- Download IPFS installation from this link: https://dist.ipfs.tech/#kubo. Choose the library for your OS.
- Unpack the .zip file and use terminal (**cd kubo**) to enter kubo folder which contains **ipfs.exe**
- Execute command: **ipfs init** (this will initialize IPFS and create default configuration)

## Configuration
- Open the config file. For example, it's Windows location is: **C:\Users\UserName\\.ipfs\config**
- Find **Gateway** object and set it's field **Writable** to **true**, in order to be able to add files to IPFS via HTTP API.

## Start IPFS server
- In terminal enter the command: **ipfs daemon**
- You should see a long message ending with these lines:
  **Gateway (writable) server listening on /ip4/127.0.0.1/tcp/8080**
  **Daemon is ready**

## Add string into IPFS server via HTTP API using Postman
- Create a **POST** request with url: http://localhost:8080/ipfs/add
- Inside **Body** tab, enter a message
- Click **Send** button
- When response is received, enter **Headers** tab and save the value of **ipfs-hash** header
  It looks something like this: **QmSum7yWd2qja6MoBKTzjqrbdtieBKmQEpTazc1M2NSBD8**
  Save it for later use (when you want to get that value)

## Read string from server via HTTP API using Postman
- Create a **GET** request with url: http://localhost:8080/ipfs/QmSum7yWd2qja6MoBKTzjqrbdtieBKmQEpTazc1M2NSBD8
  The last parameter is the hash code received as a response, when adding a string into IPFS server.
- Click **Send** button
- The response will contain the string related to the hash provided to IPFS server.