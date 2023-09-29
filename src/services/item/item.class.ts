// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import { type Item, type ItemData, type ItemPatch, type ItemQuery } from './item.schema'
import { totalAggregation } from './mongodb/total.aggregation'
import { franchisesAggregation } from './mongodb/franchises.aggregation'
import { developersAggregation } from './mongodb/developers.aggregation'
import { genresAggregation } from './mongodb/genres.aggregation'
import { restrictionsAggregation } from './mongodb/restrictions.aggregation'
import { ratingsAggregation } from './mongodb/ratings.aggregation'
import { cloneDeep, values } from 'lodash'
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
    { userId, type }: { userId: string | undefined; type?: Item['type'] },
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

  async filters2(
    { userId, type }: { userId: string | undefined; type?: Item['type'] },
    _params?: ServiceParams,
  ) {
    const items = await this.find({
      query: {
        // ...(type && { type }),
        userId,
        name: 'TEST',
        // $select: [
        //   'config',
        //   'name',
        //   'status',
        //   'time',
        //   'rating',
        //   'restriction',
        //   'genres',
        //   'developers',
        //   'franchise',
        //   'parts',
        // ],
        // $limit: 20,
      },
      paginate: false,
    })

    const part = (i: Item['time'], full: boolean) => (full ? i.replays + 1 : 1) * i.count * i.duration

    // const computePartableDuration = (item: Item, full: boolean) => {
    //   return part(item.time, full) + item.parts.reduce((acc, cur) => acc + part(cur.time, full), 0)
    // }
    const computeUnpartableDuration = (item: any, full: boolean) => part(item.time, full)

    // const round = (x: number) => Math.floor(x + 0.5)

    const DEFAULT_EXTENDED_STATISTICS = {
      items: [],
    }

    // console.time('js')
    const ratingsMap = new Map([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => [i, { count: 0 }]))
    const restrictionsMap = new Map(['G', 'PG', 'PG-13', 'R', 'NC-17'].map((i) => [i, { count: 0 }]))
    const genresMap = new Map<string, any>()
    const developersMap = new Map<string, any>()
    const franchisesMap = new Map<string, any>()
    const totalMap = new Map(
      ['in-process', 'planned', 'completed', 'postponed', 'abandoned'].map((i) => [
        i,
        { count: 0, duration: 0, fullDuration: 0 },
      ]),
    )
    for (const item of items) {
      const fullParts = [item, ...item.parts]
      // ratings
      const ratings = [...new Set([item.rating, ...item.parts.map((part) => part.rating)].filter(Boolean))]
      for (const rating of ratings) {
        const currentRating = ratingsMap.get(rating)
        if (currentRating) {
          currentRating.count++
        }
      }
      // restrictions
      const restriction = item.restriction
      const currentRestriction = restrictionsMap.get(restriction)
      if (currentRestriction) {
        currentRestriction.count++
      }
      // genres
      const genres = item.genres
      for (const genre of genres) {
        const currentGenre =
          genresMap.get(genre) ?? genresMap.set(genre, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(genre)
        if (currentGenre) {
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            if (!rating || !part.time.duration) continue
            currentGenre.items.push({
              rating: part.rating,
              duration: computeUnpartableDuration(part, false),
              fullDuration: computeUnpartableDuration(part, true),
            })
          }
        }
      }
      // developers
      const developers = [
        ...new Set([...item.developers, ...item.parts.map((part) => part.developers).flat(1)]),
      ]
      for (const developer of developers) {
        const currentDeveloper =
          developersMap.get(developer) ??
          developersMap.set(developer, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(developer)
        if (currentDeveloper) {
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            if (!rating || !part.time.duration || !part.developers.includes(developer)) continue
            currentDeveloper.items.push({
              rating,
              duration: computeUnpartableDuration(part, false),
              fullDuration: computeUnpartableDuration(part, true),
            })
          }
        }
      }
      // franchises
      const franchise = item.franchise
      const currentFranchise =
        franchisesMap.get(franchise) ??
        franchisesMap.set(franchise, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(franchise)
      if (currentFranchise) {
        for (const part of fullParts) {
          const rating = part.rating || item.rating
          if (!rating || !part.time.duration) continue
          currentFranchise.items.push({
            rating: part.rating,
            duration: computeUnpartableDuration(part, false),
            fullDuration: computeUnpartableDuration(part, true),
          })
        }
      }
      // total
      for (const part of fullParts) {
        const status = part.status
        const currentStatus = totalMap.get(status)
        if (currentStatus) {
          currentStatus.duration += computeUnpartableDuration(part, false)
          currentStatus.fullDuration += computeUnpartableDuration(part, true)
        }
      }

      // const status = item.status
      // const currentStatus = totalMap.get(status)
      // if (currentStatus) {
      //   currentStatus.count++
      //   currentStatus.duration += computePartableDuration(item, false)
      //   currentStatus.fullDuration += computePartableDuration(item, true)
      // }
    }

    const arrayFromMap = <A, B>(map: Map<A, B>) =>
      [...map.entries()].map(([value, data]) => ({ value, ...data }))

    const ratings = arrayFromMap(ratingsMap) // done
    const restrictions = arrayFromMap(restrictionsMap) // done
    const genres = arrayFromMap(genresMap) // done
    const developers = arrayFromMap(developersMap) // done
    const franchises = arrayFromMap(franchisesMap) // done
    const total = arrayFromMap(totalMap) // done
    // console.timeEnd('js')
    const response = { ratings, restrictions, genres, developers, franchises, total }
    console.dir(JSON.stringify(response, null, 2))
    return {}
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

// interface _Item {
//   _id: string
//   config: {
//     parts: {
//       extended: boolean
//     }
//   }
//   name: string
//   poster: string
//   rating: number
//   time: {
//     count: number
//     duration: number
//     replays: number
//   }
//   year: string
//   developers: string[]
//   genres: string[]
//   franchise: string
//   parts: Array<{
//     name: string
//     poster: string
//     rating: number
//     time: {
//       count: number
//       duration: number
//       replays: number
//     }
//     year: string
//     developers: string[]
//   }>
// }
