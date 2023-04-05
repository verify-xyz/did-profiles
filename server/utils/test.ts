import * as IPFS from 'ipfs-core'

async function test()
{
  const ipfs = await IPFS.create()
  const {cid} = await ipfs.add('Hello world')
  console.info(cid)
}

test();