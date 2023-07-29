import { storage } from './storage/storage'
import { items } from './item/item'
import { users } from './user/user'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(storage)
  app.configure(items)
  app.configure(users)
}
