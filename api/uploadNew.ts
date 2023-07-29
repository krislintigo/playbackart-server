// my userId - 6474e01af873f22f6090936d
import { app } from '../src/app'
import * as fs from 'fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { omit } from 'lodash'

const argv = yargs(hideBin(process.argv)).argv as unknown as { userId: string }
if (!argv.userId) throw new Error('Pass userId to command line!')

async function main() {
  const data = await fs.readFile('./api/result.json', 'utf8')
  const items = JSON.parse(data)
  const creations = items.map((item: any) => ({
    ...omit(item, '_id'),
    userId: item.userId || argv.userId,
  }))
  console.log(creations.length)
  await app.service('items').create(creations)
  process.exit(0)
}

void main()
