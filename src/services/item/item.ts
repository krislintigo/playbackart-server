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
import { clearAfterPatch, clearAfterRemove, postersUpload } from '../../resolvers/files'
import { timeSort } from './item.hooks'

export * from './item.class'
export * from './item.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const items = (app: Application) => {
  // Register our service on the Feathers application
  app.use(itemPath, new ItemService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: itemMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(itemPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(itemExternalResolver), schemaHooks.resolveResult(itemResolver)],
      create: [postersUpload, authenticate('jwt'), authorize()],
      patch: [postersUpload, authenticate('jwt'), authorize()],
      remove: [authenticate('jwt'), authorize()],
    },
    before: {
      all: [
        // schemaHooks.validateQuery(itemQueryValidator),
        schemaHooks.resolveQuery(itemQueryResolver),
      ],
      // find: [timeSort],
      get: [],
      create: [schemaHooks.validateData(itemDataValidator), schemaHooks.resolveData(itemDataResolver)],
      patch: [schemaHooks.validateData(itemPatchValidator), schemaHooks.resolveData(itemPatchResolver)],
      remove: [],
    },
    after: {
      all: [],
      remove: [clearAfterRemove],
    },
    error: {
      all: [],
    },
  })

  setTimeout(async () => {
    // for (const i of ['1', '2', '3', '4', '5']) {
    //   console.time('filters 1 (small), iteration ' + i)
    //   await app.service('items').filters({ userId: '647756288c4529458af2656e', type: undefined })
    //   console.timeEnd('filters 1 (small), iteration ' + i)
    // }
    //
    // console.log()
    //
    // for (const i of ['1', '2', '3', '4', '5']) {
    //   console.time('filters 2 (small), iteration ' + i)
    //   await app.service('items').filters2({ userId: '647756288c4529458af2656e', type: undefined })
    //   console.timeEnd('filters 2 (small), iteration ' + i)
    // }
    //
    // console.log()
    //
    // for (const i of ['1', '2', '3', '4', '5']) {
    //   console.time('filters 1 (huge), iteration ' + i)
    //   await app.service('items').filters({ userId: '6474e01af873f22f6090936d', type: undefined })
    //   console.timeEnd('filters 1 (huge), iteration ' + i)
    // }
    //
    // console.log()

    for (const i of ['1']) {
      console.time('filters 2 (huge), iteration ' + i)
      await app.service('items').filters2({ userId: '6474e01af873f22f6090936d', type: undefined })
      console.timeEnd('filters 2 (huge), iteration ' + i)
      console.log()
    }
  }, 500)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [itemPath]: ItemService
  }
}
