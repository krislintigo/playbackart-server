// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  itemDataValidator,
  itemPatchValidator,
  itemQueryValidator,
  itemResolver,
  itemExternalResolver,
  itemDataResolver,
  itemPatchResolver,
  itemQueryResolver,
} from './item.schema'

import type { Application } from '../../declarations'
import { ItemService, getOptions } from './item.class'
import { itemPath, itemMethods } from './item.shared'
import { authorize } from 'feathers-casl'
import { clearAfterRemove, postersUpload } from '../../resolvers/files'
import { emitCUD } from './item.hooks'
import { ratingSortPipeline, timeSortPipeline } from './item.sort'
import { $sort } from '../../hooks/sort'
import { $pipeline } from '../../hooks/pipeline'

export * from './item.class'
export * from './item.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const items = (app: Application) => {
  // Register our service on the Feathers application
  app.use(itemPath, new ItemService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: itemMethods,
    // You can add additional custom events to be sent to clients here
    events: ['cud'],
  })
  // Initialize hooks
  app.service(itemPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(itemExternalResolver),
        schemaHooks.resolveResult(itemResolver),
        // schemaHooks.validateQuery(itemQueryValidator),
        schemaHooks.resolveQuery(itemQueryResolver),
      ],
      find: [],
      create: [postersUpload, authenticate('jwt'), authorize()],
      patch: [postersUpload, authenticate('jwt'), authorize()],
      remove: [authenticate('jwt'), authorize()],
    },
    before: {
      all: [],
      find: [
        $sort({
          time: timeSortPipeline,
          rating: ratingSortPipeline,
        }),
        $pipeline(),
      ],
      create: [schemaHooks.validateData(itemDataValidator), schemaHooks.resolveData(itemDataResolver)],
      patch: [schemaHooks.validateData(itemPatchValidator), schemaHooks.resolveData(itemPatchResolver)],
      remove: [],
    },
    after: {
      all: [],
      create: [emitCUD],
      patch: [emitCUD],
      remove: [emitCUD, clearAfterRemove],
    },
    error: {
      all: [],
    },
  })

  // setTimeout(async () => {
  //   const items = await app
  //     .service(itemPath)
  //     .find({ paginate: false, query: { $select: ['_id', 'genres', 'categories'] } })
  //   console.log('items', [...new Set(items.map((item: any) => item.genres).flat())])
  //   const promises = items.map(async (item) => {
  //     // const genres = [...item.genres]
  //     const categories = [...item.categories]
  //     const genres = item.genres
  //       .map((genre: string) => {
  //         switch (genre) {
  //           case 'sdf':
  //             return ''
  //           case 'Жанр2':
  //             return ''
  //           case 'Жанр1':
  //             return ''
  //           case 'Приключенческая игра':
  //             return 'adventure'
  //           case 'Survival horror':
  //             return ['survival', 'horror']
  //           case 'Action':
  //             return 'action'
  //           case 'Открытый мир':
  //             categories.push('Открытый мир')
  //             return ''
  //           case 'RPG':
  //             return 'rpg'
  //           case 'FPS':
  //             categories.push('FPS')
  //             return 'shooter'
  //           case 'Научная фантастика':
  //             return 'sci-fi'
  //           case 'Политическая интрига':
  //             categories.push('Политическая интрига')
  //             return ''
  //           case 'Боевые искусства':
  //             categories.push('Боевые искусства')
  //             return 'action'
  //           case 'Боевик':
  //             return 'action'
  //           case 'Стелс':
  //             categories.push('Стелс')
  //             return ''
  //           case 'Horror':
  //             return 'horror'
  //           case 'TEMPLATE':
  //             categories.push('TEMPLATE')
  //             return ''
  //           case 'Военный':
  //             categories.push('Военное')
  //             return ''
  //           case 'Мелодрама':
  //             return ''
  //           case 'Мюзикл':
  //             return 'musical'
  //           case 'Инди':
  //             categories.push('Инди')
  //             return ''
  //           case 'Симуляторы':
  //             return 'simulation'
  //           case 'TPS':
  //             categories.push('TPS')
  //             return 'shooter'
  //           case 'RGP':
  //             return 'rpg'
  //           case 'Платформер':
  //             return 'platform'
  //           case 'Гонки':
  //             return 'sports'
  //           case 'Музыка':
  //             return 'musical'
  //           case 'Файтинг':
  //             return 'fighting'
  //           case 'Песочница':
  //             return 'sandbox'
  //           case 'Survival':
  //             return 'survival'
  //           case 'Фантастика':
  //             return 'sci-fi'
  //           case 'Приключения':
  //             return 'adventure'
  //           case 'Экшен':
  //             return 'action'
  //           case 'Вестерн':
  //             categories.push('Вестерн')
  //             return ''
  //           case 'Триллер':
  //             return 'thriller'
  //           case 'Биография':
  //             return 'biography'
  //           case 'Драма':
  //             return 'drama'
  //           case 'Криминал':
  //             return 'crime'
  //           case 'Романтика':
  //             return 'romance'
  //           case 'Ужасы':
  //             return 'horror'
  //           case 'Аниме':
  //             categories.push('Аниме')
  //             return ''
  //           case 'Фэнтези':
  //             return 'fantasy'
  //           case 'Военное':
  //             categories.push('Военное')
  //             return ''
  //           case 'Комедия':
  //             return 'comedy'
  //           case 'История':
  //             return 'historical'
  //           case 'Мультфильм':
  //             return 'animation'
  //           case 'Детектив':
  //             categories.push('Детектив')
  //             return 'crime'
  //           case 'Документальный':
  //             return 'documentary'
  //           case 'Adventure':
  //             return 'adventure'
  //           default:
  //             return genre
  //         }
  //       })
  //       .filter((genre) => genre)
  //       .flat(1)
  //     // @ts-expect-error test
  //     return await app.service(itemPath).patch(item._id as string, { genres, categories })
  //   })
  //   await Promise.all(promises)
  //   console.log('done')
  // })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [itemPath]: ItemService
  }
}
