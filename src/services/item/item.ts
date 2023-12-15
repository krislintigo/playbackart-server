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
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [itemPath]: ItemService
  }
}
