import { items } from './item/item'
import { users } from './user/user'
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(items)
  app.configure(users)
}
