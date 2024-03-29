import { Type } from '@feathersjs/typebox'

export const file = {
  name: Type.String(),
  key: Type.String(),
  uploadedAt: Type.String(),
}

export const createdAndUpdatedAt = {
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
}
