// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import { type Item, type ItemData, type ItemPatch, type ItemQuery } from './item.schema'
import { cloneDeep, omit } from 'lodash'
export type { Item, ItemData, ItemPatch, ItemQuery }

export interface SimpleStatistic<T> {
  value: T
  count: number
}

interface ExtendedStatisticInput<T> extends SimpleStatistic<T> {
  coefficient: number
  items: Array<{
    rating: number
    duration: number
    fullDuration: number
  }>
}

export type ExtendedStatistic<T> = Omit<ExtendedStatisticInput<T>, 'items'>

export interface TotalStatistic {
  status: Item['status']
  count: number
  duration: number
  fullDuration: number
}

export interface FiltersOutput {
  ratings: Array<SimpleStatistic<number>>
  restrictions: Array<SimpleStatistic<Item['restriction']>>
  genres: Array<ExtendedStatistic<string>>
  developers: Array<ExtendedStatistic<string>>
  franchises: Array<ExtendedStatistic<string>>
  total: TotalStatistic[]
}

export interface ItemParams extends MongoDBAdapterParams<ItemQuery> {}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ItemService<ServiceParams extends Params = ItemParams> extends MongoDBService<
  Item,
  ItemData,
  ItemParams,
  ItemPatch
> {
  // async filters_old(
  //   { userId, type }: { userId: string | undefined; type?: Item['type'] },
  //   _params?: ServiceParams,
  // ): Promise<FiltersOutput> {
  //   if (!userId) throw new Error('No userId provided')
  //
  //   const result = (await this.find({
  //     query: {
  //       ...(type && { type }),
  //       userId,
  //     },
  //     pipeline: [
  //       {
  //         $facet: {
  //           ratings: ratingsAggregation,
  //           restrictions: restrictionsAggregation,
  //           genres: genresAggregation,
  //           developers: developersAggregation,
  //           franchises: franchisesAggregation,
  //           total: totalAggregation,
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 0,
  //           ratings: 1,
  //           restrictions: 1,
  //           genres: 1,
  //           developers: 1,
  //           franchises: 1,
  //           total: 1,
  //         },
  //       },
  //     ],
  //     paginate: false,
  //   })) as any
  //   return result.at(0)
  // }

  async filters(
    { userId, type }: { userId: string | undefined; type?: Item['type'] },
    _params?: ServiceParams,
  ): Promise<FiltersOutput> {
    const items = await this.find({
      query: {
        ...(type && { type }),
        userId,
        // name: 'Игра престолов',
      },
      paginate: false,
    })

    const computeDuration = (
      item: Item,
      { full = false, includeParts = false }: { full?: boolean; includeParts?: boolean },
    ) => {
      const part = (i: Item['time']) => (full ? i.replays + 1 : 1) * i.count * i.duration

      return (
        part(item.time) + (includeParts ? item.parts?.reduce((acc, cur) => acc + part(cur.time), 0) ?? 0 : 0)
      )
    }

    const ratingCoefficient = (rating: number) => {
      switch (rating) {
        case 10:
          return 7
        case 9:
          return 2
        default:
          return 1
      }
    }

    const DEFAULT_SIMPLE_STATISTICS = {
      count: 0,
    }
    const DEFAULT_EXTENDED_STATISTICS: Omit<ExtendedStatisticInput<string>, 'value'> = {
      coefficient: 0,
      count: 0,
      items: [],
    }
    const DEFAULT_TOTAL_STATISTICS: Omit<TotalStatistic, 'status'> = {
      count: 0,
      duration: 0,
      fullDuration: 0,
    }

    const ratingsMap = new Map<number, Omit<SimpleStatistic<number>, 'value'>>()
    const restrictionsMap = new Map<
      Item['restriction'],
      Omit<SimpleStatistic<Item['restriction']>, 'value'>
    >()
    const genresMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const developersMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const franchisesMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const totalMap = new Map<Item['status'], Omit<TotalStatistic, 'status'>>()

    for (const item of items) {
      const fullParts = [item, ...item.parts] as Item[]
      // ratings
      const ratings = [...new Set(fullParts.map((part) => part.rating).filter(Boolean))]
      for (const rating of ratings) {
        const currentRating =
          ratingsMap.get(rating) ?? ratingsMap.set(rating, cloneDeep(DEFAULT_SIMPLE_STATISTICS)).get(rating)
        if (currentRating) {
          currentRating.count++
        }
      }
      // restrictions
      const restriction = item.restriction
      const currentRestriction =
        restrictionsMap.get(restriction) ??
        restrictionsMap.set(restriction, cloneDeep(DEFAULT_SIMPLE_STATISTICS)).get(restriction)
      if (currentRestriction) {
        currentRestriction.count++
      }
      // genres
      const genres = item.genres
      for (const genre of genres) {
        const currentGenre =
          genresMap.get(genre) ?? genresMap.set(genre, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(genre)
        if (currentGenre) {
          currentGenre.count++
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            if (!rating) continue
            currentGenre.items.push({
              rating,
              duration: computeDuration(part, {}),
              fullDuration: computeDuration(part, { full: true }),
            })
          }
        }
      }
      // developers
      const developers = [...new Set(fullParts.map((part) => part.developers).flat(1))]
      for (const developer of developers) {
        const currentDeveloper =
          developersMap.get(developer) ??
          developersMap.set(developer, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(developer)
        if (currentDeveloper) {
          currentDeveloper.count++
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            const partIncludesDeveloper = item.config.parts.multipleDevelopers
              ? part.developers.includes(developer)
              : true
            if (!rating || !partIncludesDeveloper) continue
            currentDeveloper.items.push({
              rating,
              duration: computeDuration(part, {}),
              fullDuration: computeDuration(part, { full: true }),
            })
          }
        }
      }
      // franchises
      const franchise = item.franchise // also use franchise for huge elements? (Тьма)
      if (franchise) {
        const currentFranchise =
          franchisesMap.get(franchise) ??
          franchisesMap.set(franchise, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(franchise)
        if (currentFranchise) {
          currentFranchise.count++
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            if (!rating) continue
            currentFranchise.items.push({
              rating,
              duration: computeDuration(part, {}),
              fullDuration: computeDuration(part, { full: true }),
            })
          }
        }
      }
      // total
      for (const part of fullParts) {
        const status = part.status
        const currentStatus =
          totalMap.get(status) ?? totalMap.set(status, cloneDeep(DEFAULT_TOTAL_STATISTICS)).get(status)
        if (currentStatus) {
          currentStatus.duration += computeDuration(part, { includeParts: false })
          currentStatus.fullDuration += computeDuration(part, { full: true, includeParts: false })
        }
      }
      const mainStatus = totalMap.get(item.status)
      if (mainStatus) mainStatus.count++
    }

    const totalDuration = [...totalMap.values()].reduce((acc, cur) => acc + cur.duration, 0)
    const computeCoefficients = (map: Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>) => {
      map.forEach((item) => {
        item.coefficient =
          item.items
            .map((i) => i.fullDuration * ratingCoefficient(i.rating))
            .reduce((acc, cur) => acc + cur, 0) / totalDuration
      })
    }

    computeCoefficients(genresMap)
    computeCoefficients(developersMap)
    computeCoefficients(franchisesMap)

    const ratings = [...ratingsMap.entries()].map(([value, data]) => ({ value, ...data }))
    const restrictions = [...restrictionsMap.entries()].map(([value, data]) => ({ value, ...data }))
    const genres = [...genresMap.entries()].map(([value, data]) => ({ value, ...omit(data, 'items') }))
    const developers = [...developersMap.entries()].map(([value, data]) => ({
      value,
      ...omit(data, 'items'),
    }))
    const franchises = [...franchisesMap.entries()].map(([value, data]) => ({
      value,
      ...omit(data, 'items'),
    }))
    const total = [...totalMap.entries()].map(([status, data]) => ({ status, ...data }))

    return { ratings, restrictions, genres, developers, franchises, total }
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
