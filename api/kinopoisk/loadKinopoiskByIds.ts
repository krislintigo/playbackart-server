import { getRestriction, getType, getGenre } from './helpers'
import * as fs from 'fs'
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
    const poster = await fetch(film.posterUrlPreview)
      .then(async (response) => await response.arrayBuffer())
      .then((buffer) => 'data:image/jpeg;base64,' + Buffer.from(buffer).toString('base64'))
    return {
      config: {
        parts: {
          extended: false,
          multiplePosters: false,
          multipleRatings: false,
          multipleDevelopers: false,
        },
        time: {
          extended: false,
        },
      },
      name: film.nameRu,
      poster: {
        name: film.nameRu,
        key: '',
        uploadedAt: '',
        buffer: poster,
      },
      rating: 0,
      status: 'postponed',
      type: getType(film.type),
      restriction: getRestriction(film.ratingMpaa),
      genres: [
        ...new Set(
          film.genres.map(({ genre }: { genre: string }) => getGenre(genre)).filter((genre: string) => genre),
        ),
      ],
      categories: ['TEMPLATE'],
      time: {
        count: 1,
        duration: film.filmLength,
        replays: 0,
        sessions: [],
      },
      year: film.year.toString() || '',
      developers: [],
      franchise: '',
      parts: [],
    }
  })

  const response = await Promise.all(mapped)
  fs.writeFileSync('./api/result.json', JSON.stringify(response))
}

void main()
