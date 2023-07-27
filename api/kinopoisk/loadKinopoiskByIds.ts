import { getRestriction, getType } from './helpers'
import * as fs from 'fs'
import { capitalize } from 'lodash'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = yargs(hideBin(process.argv)).argv as unknown as { ids: string }
if (!argv.ids) throw new Error('Pass ids to command line!')
const ids = argv.ids.toString().split(',')

async function wait(milliseconds: number) {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function main() {
  const mapped = ids.map(async (id, i) => {
    console.log(id)
    await wait(i * 100)
    const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': '79c1b5a4-b204-4109-aff6-0659663f06f5',
        'Content-Type': 'application/json',
      },
    })
    const film: any = await response.json()
    console.log(id, ':', film?.nameRu)
    return {
      name: film.nameRu,
      poster: film.posterUrlPreview || '',
      rating: 0,
      status: 'postponed',
      type: getType(film.type),
      restriction: getRestriction(film.ratingMpaa),
      genres: ['TEMPLATE'].concat(film.genres.map(({ genre }: { genre: string }) => capitalize(genre))),
      time: {
        count: 1,
        duration: film.filmLength,
        replays: 0,
      },
      year: film.year.toString() || '',
      developers: [],
      franchise: '',
    }
  })

  const response = await Promise.all(mapped)
  console.log(response)
  fs.writeFileSync('./api/result.json', JSON.stringify(response))
}

void main()
