import { app } from '../src/app'
import fs from 'fs-extra'

const writeContents = async (data: Array<{ Key: string }>) => {
  const files = data.map(async ({ Key }) => {
    if (!Key) throw new Error('ERROR')
    const { file } = await app.service('storage').get(Key)
    const [service, instance] = Key.split('/')
    const path = [service, instance].join('/')
    await fs.ensureDir(`backup/storage/${path}`)
    const writable = await file.transformToByteArray()
    await fs.writeFile(`backup/storage/${Key}`, writable)
    console.log('done writing', Key)
  })
  await Promise.all(files)
}

const main = async () => {
  await fs.ensureDir('backup/storage')
  const users = await app.service('users').find({ paginate: false })
  await fs.writeFile(`backup/users.json`, JSON.stringify(users))
  const items = await app.service('items').find({ paginate: false })
  await fs.writeFile(`backup/items.json`, JSON.stringify(items))
  let nextToken
  do {
    // @ts-expect-error fix
    const response = await app.service('storage').find({ Prefix: 'items', ContinuationToken: nextToken })
    nextToken = response.NextContinuationToken
    if (!response.Contents) throw new Error('NO DATA')
    await writeContents(response.Contents)
  } while (nextToken)
  process.exit(0)
}

void main()
