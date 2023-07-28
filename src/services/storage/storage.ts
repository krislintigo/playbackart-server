// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import type { Application } from '../../declarations'
import { StorageService, getOptions } from './storage.class'
import { storagePath, storageMethods } from './storage.shared'

export * from './storage.class'

// A configure function that registers the service and its hooks via `app.configure`
export const storage = (app: Application) => {
  // Register our service on the Feathers application
  app.use(storagePath, new StorageService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: storageMethods,
    // You can add additional custom events to be sent to clients here
    events: [],
  })
  // Initialize hooks
  app.service(storagePath).hooks({
    around: {
      all: [authenticate('jwt')],
    },
    before: {
      all: [],
      get: [],
      create: [],
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
    [storagePath]: StorageService
  }
}
