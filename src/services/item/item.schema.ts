// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax, StringEnum, ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import { userSchema } from '../user/user.schema'
import { createdAndUpdatedAt } from '../common.schema'
import { resolveOptionalObjectId, resolveOptionalQueryObjectId } from '../../resolvers/objectId'

// Main data model schema
export const itemSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    userId: ObjectIdSchema(),
    user: Type.Ref(userSchema),

    name: Type.String(),
    image: Type.String(),
    rating: Type.Number({ minimum: 0, maximum: 10 }),
    status: StringEnum(['in-process', 'planned', 'completed', 'postponed', 'abandoned']),
    type: StringEnum(['movie', 'series', 'game', 'book']),
    restriction: StringEnum(['', 'G', 'PG', 'PG-13', 'R', 'NC-17']),
    genres: Type.Array(Type.String()),
    time: Type.Object({
      count: Type.Number({ minimum: 1 }),
      duration: Type.Number({ minimum: 0 }),
    }),
    year: Type.String(),
    developers: Type.Array(Type.String()),
    franchise: Type.String(),

    ...createdAndUpdatedAt,
  },
  { $id: 'Item', additionalProperties: false },
)
export type Item = Static<typeof itemSchema>
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
  userId: resolveOptionalObjectId,
})

// Schema for updating existing entries
export const itemPatchSchema = Type.Partial(itemSchema, {
  $id: 'ItemPatch',
})
export type ItemPatch = Static<typeof itemPatchSchema>
export const itemPatchValidator = getValidator(itemPatchSchema, dataValidator)
export const itemPatchResolver = resolve<Item, HookContext>({
  userId: resolveOptionalObjectId,
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
  userId: resolveOptionalQueryObjectId,
})
