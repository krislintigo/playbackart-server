// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Storage, StorageData, StoragePatch, StorageQuery, StorageService } from './storage.class'

export type { Storage, StorageData, StoragePatch, StorageQuery }

export type StorageClientService = Pick<StorageService<Params<StorageQuery>>, (typeof storageMethods)[number]>

export const storagePath = 'storage'

export const storageMethods = ['get', 'create', 'remove'] as const

export const storageClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(storagePath, connection.service(storagePath), {
    methods: storageMethods,
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [storagePath]: StorageClientService
  }
}
