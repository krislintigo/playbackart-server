// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { userSchema } from '../user/user.schema'
import { createdAndUpdatedAt, file } from '../common.schema'
import { resolveObjectId, resolveQueryObjectId } from '../../resolvers/objectId'

const config = {
  parts: Type.Object({
    extended: Type.Boolean(),
    multiplePosters: Type.Boolean(),
    multipleRatings: Type.Boolean(),
    multipleDevelopers: Type.Boolean(),
  }),
  time: Type.Object({
    extended: Type.Boolean(),
  }),
}

const sharedData = {
  name: Type.String(),
  poster: Type.Object(file),
  rating: Type.Number({ minimum: 0, maximum: 10 }),
  time: Type.Object({
    count: Type.Number({ minimum: 1 }),
    duration: Type.Number({ minimum: 0 }),
    replays: Type.Number({ minimum: 0 }),
    sessions: Type.Array(
      Type.Object({
        name: Type.String(),
        duration: Type.Number({ minimum: 0 }),
      }),
    ),
  }),
  year: Type.String(),
  developers: Type.Array(Type.String()),
  status: StringEnum(['in-process', 'planned', 'completed', 'postponed', 'abandoned']),
}

export const itemSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: ObjectIdSchema(),
    user: Type.Ref(userSchema),

    config: Type.Object(config),

    type: StringEnum(['movie', 'series', 'game', 'book']),
    restriction: StringEnum(['', 'G', 'PG', 'PG-13', 'R', 'NC-17']),
    genres: Type.Array(Type.String()),
    franchise: Type.String(),
    categories: Type.Array(Type.String()),
    parts: Type.Array(Type.Object(sharedData)),

    ...sharedData,

    ...createdAndUpdatedAt,
  },
  { $id: 'Item', additionalProperties: false },
)
const itemPartSchema = Type.Object(sharedData)

export type Item = Static<typeof itemSchema>
export type Part = Static<typeof itemPartSchema>

export const itemValidator = getValidator(itemSchema, dataValidator)
export const itemResolver = resolve<Item, HookContext>({})

export const itemExternalResolver = resolve<Item, HookContext>({})

// Schema for creating new entries
export const itemDataSchema = Type.Omit(itemSchema, ['_id', 'user'], {
  $id: 'ItemData',
})
export type ItemData = Static<typeof itemDataSchema>
export const itemDataValidator = getValidator(itemDataSchema, dataValidator)
export const itemDataResolver = resolve<Item, HookContext>({
  userId: resolveObjectId,
})

// Schema for updating existing entries
export const itemPatchSchema = Type.Partial(itemDataSchema, {
  $id: 'ItemPatch',
})
export type ItemPatch = Static<typeof itemPatchSchema>
export const itemPatchValidator = getValidator(itemPatchSchema, dataValidator)
export const itemPatchResolver = resolve<Item, HookContext>({
  userId: resolveObjectId,
})

// Schema for allowed query properties
export const itemQueryProperties = Type.Omit(itemSchema, ['user'])
export const itemQuerySchema = Type.Intersect(
  [
    querySyntax(itemQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false },
)
export type ItemQuery = Static<typeof itemQuerySchema>
export const itemQueryValidator = getValidator(itemQuerySchema, queryValidator)
export const itemQueryResolver = resolve<ItemQuery, HookContext>({
  userId: resolveQueryObjectId,
})
