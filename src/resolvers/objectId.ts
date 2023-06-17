import {
  resolveObjectId as _resolveObjectId,
  resolveQueryObjectId as _resolveQueryObjectId,
} from '@feathersjs/mongodb'

export const resolveObjectId = async (value: any) => {
  if (value) return await _resolveObjectId(value)
}

export const resolveQueryObjectId = async (value: any) => {
  if (value) return await _resolveQueryObjectId(value)
}
