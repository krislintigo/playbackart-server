// my userId - 6474e01af873f22f6090936d
import { app } from '../src/app'
import * as fs from 'fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv)).argv as unknown as { userId: string }
if (!argv.userId) throw new Error('Pass userId to command line!')

async function main() {
  const data = await fs.readFile('./api/result.json', 'utf8')
  const items = JSON.parse(data)
  const creations = items.map((item: any) => ({
    name: item.name,
    image: item.image || '',
    rating: item.rating || 0,
    status: item.status,
    type: item.type,
    restriction: item.restriction || '',
    genres: item.genres || [],
    time: {
      count: item.time.count || 1,
      duration: item.time.duration || 0,
      replays: 0,
    },
    year: item.year || '',
    developers: item.developers || [],
    franchise: item.franchise || '',
    userId: argv.userId,
  }))
  console.log(creations.length)
  await app.service('items').create(creations)
  process.exit()
}

void main()
