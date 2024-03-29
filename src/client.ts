// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { storageClient } from './services/storage/storage.shared'
import { itemClient } from './services/item/item.shared'
import { userClient } from './services/user/user.shared'

export type { Storage, StorageData, StorageQuery, StoragePatch } from './services/storage/storage.shared'
export type { Item, ItemData, ItemQuery, ItemPatch } from './services/item/item.shared'
export type { User, UserData, UserQuery, UserPatch } from './services/user/user.shared'
export type {
  SimpleStatistic,
  ExtendedStatistic,
  TotalStatistic,
  FiltersOutput,
} from './services/item/item.class'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the playbackart-server app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {},
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(userClient)
  client.configure(itemClient)
  client.configure(storageClient)
  return client
}
