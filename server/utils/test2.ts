import * as IPFS from 'ipfs-core'
import { concat as uint8ArrayConcat } from 'uint8arrays'
import { fromString as uint8ArrayFromString } from 'uint8arrays'
import { toString as uint8ArrayToString } from 'uint8arrays'

async function main () {
  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  const file = await node.add({
    path: 'hello.txt',
    content: uint8ArrayFromString('Hello World 101')
  })

  console.log('Added file:', file.path, file.cid.toString())

  const data = uint8ArrayConcat(await all(node.cat(file.cid)))

  console.log('Added file contents:', uint8ArrayToString(data))
}

async function all(source) {
  const arr = [];
  for await (const entry of source) arr.push(entry);
  return arr;
}

main()