import { resolveObjectId, resolveQueryObjectId } from '@feathersjs/mongodb'

export const resolveOptionalObjectId = async (value: any) => {
  if (value) return await resolveObjectId(value)
}

export const resolveOptionalQueryObjectId = async (value: any) => {
  if (value) return await resolveQueryObjectId(value)
}
