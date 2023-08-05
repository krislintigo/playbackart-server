import * as fs from 'fs/promises'
import { app } from '../src/app'
import { omit } from 'lodash'

async function main() {
  const file = await fs.readFile('./api/all.txt', 'utf-8')
  const { data: items, total } = JSON.parse(file)
  const map = items.map(async (item: any, i: number) => {
    // if (i > 10) return
    if (item.poster.key) {
      const buffer = await fs.readFile('./api/' + item.poster.key, 'base64')
      item.poster.buffer = 'data:image/jpeg;base64,' + buffer
      item.poster.key = ''
    }
    for (const part of item.parts) {
      if (!part.poster.key) continue
      const buffer = await fs.readFile('./api/' + part.poster.key, 'base64')
      part.poster.buffer = 'data:image/jpeg;base64,' + buffer
      part.poster.key = ''
    }
    // @ts-expect-error
    await app.service('items').create(omit(item, '_id'))
    console.log('+', item.name, `(${i} из ${total})`)
  })

  await Promise.all(map)
  // process.exit(0)
}

void main()
