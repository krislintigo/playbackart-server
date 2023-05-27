import { Type } from '@feathersjs/typebox'

export const createdAndUpdatedAt = {
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
}
