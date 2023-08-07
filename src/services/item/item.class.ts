// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import type { Item, ItemData, ItemPatch, ItemQuery } from './item.schema'
import { totalAggregation } from './mongodb/total.aggregation'
import { franchisesAggregation } from './mongodb/franchises.aggregation'
import { developersAggregation } from './mongodb/developers.aggregation'
import { genresAggregation } from './mongodb/genres.aggregation'
import { restrictionsAggregation } from './mongodb/restrictions.aggregation'
import { ratingsAggregation } from './mongodb/ratings.aggregation'
export type { Item, ItemData, ItemPatch, ItemQuery }

export interface SimpleStatistic<T> {
  value: T
  count: number
}

export interface ExtendedStatistic<T> extends SimpleStatistic<T> {
  ratings: number[]
  durations: number[]
  fullDurations: number[]
}

export interface FiltersOutput {
  ratings: Array<SimpleStatistic<number>>
  restrictions: Array<SimpleStatistic<number>>
  genres: Array<ExtendedStatistic<string>>
  developers: Array<ExtendedStatistic<string>>
  franchises: Array<ExtendedStatistic<string>>
  total: Array<{
    status: Item['status']
    count: number
    duration: number
    fullDuration: number
  }>
}

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
    _params?: ServiceParams,
  ): Promise<FiltersOutput> {
    if (!userId) throw new Error('No userId provided')

    const result = (await this.find({
      query: {
        ...(type && { type }),
        userId,
      },
      pipeline: [
        {
          $facet: {
            ratings: ratingsAggregation,
            restrictions: restrictionsAggregation,
            genres: genresAggregation,
            developers: developersAggregation,
            franchises: franchisesAggregation,
            total: totalAggregation,
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
            total: 1,
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
    operators: ['$regex', '$options', '$all'],
    multi: ['create'],
  }
}

// parts: {
//   extended: boolean,
//   multiplePosters: boolean,
//   multipleRatings: boolean,
//   multipleDevelopers: boolean,
// },

interface Item2 {
  _id: string
  config: {
    parts: {
      extended: boolean
    }
  }
  name: string
  poster: string
  rating: number
  time: {
    count: number
    duration: number
    replays: number
  }
  year: string
  developers: string[]
  genres: string[]
  franchise: string
  parts: Array<{
    name: string
    poster: string
    rating: number
    time: {
      count: number
      duration: number
      replays: number
    }
    year: string
    developers: string[]
  }>
}
