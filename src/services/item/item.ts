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
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(itemExternalResolver),
        schemaHooks.resolveResult(itemResolver),
      ],
    },
    before: {
      all: [schemaHooks.validateQuery(itemQueryValidator), schemaHooks.resolveQuery(itemQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(itemDataValidator), schemaHooks.resolveData(itemDataResolver)],
      patch: [schemaHooks.validateData(itemPatchValidator), schemaHooks.resolveData(itemPatchResolver)],
      remove: [],
    },
    after: {
      all: [],
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
