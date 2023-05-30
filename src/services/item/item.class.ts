// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { Item, ItemData, ItemPatch, ItemQuery } from './item.schema'
export type { Item, ItemData, ItemPatch, ItemQuery }

export interface ItemParams extends MongoDBAdapterParams<ItemQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ItemService<ServiceParams extends Params = ItemParams> extends MongoDBService<
  Item,
  ItemData,
  ItemParams,
  ItemPatch
> {
  async filters(
    { userId, type }: { userId: string | undefined; type: Item['type'] | undefined },
    _params: ServiceParams,
  ): Promise<{
    ratings: Array<{
      value: number
      count: number
    }>
    restrictions: Array<{
      value: string
      count: number
    }>
    genres: Array<{
      value: string
      ratings: number[]
      durations: number[]
      count: number
    }>
    developers: Array<{
      value: string
      ratings: number[]
      durations: number[]
      count: number
    }>
    franchises: Array<{
      value: string
      ratings: number[]
      durations: number[]
      count: number
    }>
    total: {
      count: number
      duration: number
    }
  }> {
    if (!userId) throw new Error('No userId provided')

    const result = (await this.find({
      query: {
        ...(type && { type }),
        userId,
      },
      pipeline: [
        {
          $facet: {
            ratings: [
              {
                $group: {
                  _id: '$rating',
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  ratings: { $push: { value: '$_id', count: '$count' } },
                },
              },
              { $unwind: '$ratings' },
              { $replaceRoot: { newRoot: '$ratings' } },
            ],
            restrictions: [
              {
                $group: {
                  _id: '$restriction',
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  restrictions: { $push: { value: '$_id', count: '$count' } },
                },
              },
              { $unwind: '$restrictions' },
              { $replaceRoot: { newRoot: '$restrictions' } },
            ],
            genres: [
              { $unwind: '$genres' },
              {
                $group: {
                  _id: '$genres',
                  ratings: { $push: '$rating' },
                  durations: { $push: { $multiply: ['$time.count', '$time.duration'] } },
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  genres: {
                    $push: {
                      value: '$_id',
                      ratings: '$ratings',
                      durations: '$durations',
                      count: '$count',
                    },
                  },
                },
              },
              { $unwind: '$genres' },
              { $replaceRoot: { newRoot: '$genres' } },
            ],
            developers: [
              { $unwind: '$developers' },
              {
                $group: {
                  _id: '$developers',
                  ratings: { $push: '$rating' },
                  durations: { $push: { $multiply: ['$time.count', '$time.duration'] } },
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  developers: {
                    $push: {
                      value: '$_id',
                      ratings: '$ratings',
                      durations: '$durations',
                      count: '$count',
                    },
                  },
                },
              },
              { $unwind: '$developers' },
              { $replaceRoot: { newRoot: '$developers' } },
            ],
            franchises: [
              {
                $group: {
                  _id: '$franchise',
                  ratings: { $push: '$rating' },
                  durations: { $push: { $multiply: ['$time.count', '$time.duration'] } },
                  count: { $sum: 1 },
                },
              },
              {
                $group: {
                  _id: null,
                  franchises: {
                    $push: {
                      value: '$_id',
                      ratings: '$ratings',
                      durations: '$durations',
                      count: '$count',
                    },
                  },
                },
              },
              { $unwind: '$franchises' },
              { $replaceRoot: { newRoot: '$franchises' } },
            ],
            total: [
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  duration: { $sum: { $multiply: ['$time.count', '$time.duration'] } },
                },
              },
              {
                $project: {
                  _id: 0,
                  count: 1,
                  duration: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            ratings: 1,
            restrictions: 1,
            genres: 1,
            developers: 1,
            franchises: 1,
            total: {
              $cond: {
                if: { $ne: [{ $size: '$total' }, 0] },
                then: { $arrayElemAt: ['$total', 0] },
                else: { count: 0, duration: 0 },
              },
            },
          },
        },
      ],
      paginate: false,
    })) as any
    return result.at(0)
  }
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('items')),
    operators: ['$regex', '$options'],
    multi: ['create'],
  }
}
