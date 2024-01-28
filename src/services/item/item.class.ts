// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'
import type { Application } from '../../declarations'
import { type Item, type ItemData, type ItemPatch, type ItemQuery, type Part } from './item.schema'
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
  status: Item['status'] | 'all'
  count: number
  duration: number
  fullDuration: number
}

export interface FiltersOutput {
  ratings: Array<SimpleStatistic<number>>
  restrictions: Array<SimpleStatistic<Item['restriction']>>
  genres: Array<ExtendedStatistic<string>>
  categories: Array<ExtendedStatistic<string>>
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
  async filters(
    { userId, type }: { userId: string | undefined; type?: Item['type'] },
    _params?: ServiceParams,
  ): Promise<FiltersOutput> {
    const items = await this.find({
      query: {
        ...(type && { type }),
        userId,
      },
      paginate: false,
    })

    const computeDuration = (p: Part, full = false) =>
      (full ? p.time.replays + 1 : 1) * p.time.count * p.time.duration +
      p.time.sessions.reduce((acc, cur) => acc + cur.duration, 0)

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
    const categoriesMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const developersMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const franchisesMap = new Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>()
    const totalMap = new Map<Item['status'] | 'all', Omit<TotalStatistic, 'status'>>()
    const durations = {
      genres: 0,
      categories: 0,
      developers: 0,
      franchises: 0,
    }

    for (const item of items) {
      const fullParts = [item, ...item.parts]
      // RATINGS
      const ratings = [...new Set(fullParts.map((part) => part.rating).filter(Boolean))]
      for (const rating of ratings) {
        const currentRating =
          ratingsMap.get(rating) ?? ratingsMap.set(rating, cloneDeep(DEFAULT_SIMPLE_STATISTICS)).get(rating)
        if (currentRating) {
          currentRating.count++
        }
      }
      // RESTRICTIONS
      const restriction = item.restriction
      if (restriction) {
        const currentRestriction =
          restrictionsMap.get(restriction) ??
          restrictionsMap.set(restriction, cloneDeep(DEFAULT_SIMPLE_STATISTICS)).get(restriction)
        if (currentRestriction) {
          currentRestriction.count++
        }
      }
      // GENRES
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
              duration: computeDuration(part),
              fullDuration: computeDuration(part, true),
            })
          }
        }
      }
      if (genres.length) {
        for (const part of fullParts) {
          durations.genres += computeDuration(part)
        }
      }
      // CATEGORIES
      const categories = item.categories
      for (const category of categories) {
        const currentCategory =
          categoriesMap.get(category) ??
          categoriesMap.set(category, cloneDeep(DEFAULT_EXTENDED_STATISTICS)).get(category)
        if (currentCategory) {
          currentCategory.count++
          for (const part of fullParts) {
            const rating = part.rating || item.rating
            if (!rating) continue
            currentCategory.items.push({
              rating,
              duration: computeDuration(part),
              fullDuration: computeDuration(part, true),
            })
          }
        }
      }
      if (categories.length) {
        for (const part of fullParts) {
          durations.categories += computeDuration(part)
        }
      }
      // DEVELOPERS
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
              duration: computeDuration(part),
              fullDuration: computeDuration(part, true),
            })
          }
        }
      }
      if (developers.length) {
        for (const part of fullParts) {
          durations.developers += computeDuration(part)
        }
      }
      // FRANCHISES
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
              duration: computeDuration(part),
              fullDuration: computeDuration(part, true),
            })
          }
        }
      }
      if (franchise) {
        for (const part of fullParts) {
          durations.franchises += computeDuration(part)
        }
      }
      // TOTAL
      const total = totalMap.get('all') ?? totalMap.set('all', cloneDeep(DEFAULT_TOTAL_STATISTICS)).get('all')
      for (const part of fullParts) {
        const status = part.status
        const currentStatus =
          totalMap.get(status) ?? totalMap.set(status, cloneDeep(DEFAULT_TOTAL_STATISTICS)).get(status)
        if (currentStatus) {
          if (status === item.status) {
            currentStatus.duration += computeDuration(part)
            currentStatus.fullDuration += computeDuration(part, true)
          }
        }
        if (total) {
          total.duration += computeDuration(part)
          total.fullDuration += computeDuration(part, true)
        }
      }
      const mainStatus = totalMap.get(item.status)
      if (mainStatus) mainStatus.count++
      if (total) total.count++
    }

    // const totalDuration = totalMap.get('all')!.duration
    // console.log(totalDuration, durations)
    const computeCoefficients = (
      map: Map<string, Omit<ExtendedStatisticInput<string>, 'value'>>,
      total: number,
    ) => {
      map.forEach((item) => {
        item.coefficient =
          item.items
            .map((i) => i.fullDuration * ratingCoefficient(i.rating))
            .reduce((acc, cur) => acc + cur, 0) / total
      })
    }

    computeCoefficients(genresMap, durations.genres)
    computeCoefficients(categoriesMap, durations.categories)
    computeCoefficients(developersMap, durations.developers)
    computeCoefficients(franchisesMap, durations.franchises)
    console.log(categoriesMap)

    const ratings = [...ratingsMap.entries()].map(([value, data]) => ({ value, ...data }))
    const restrictions = [...restrictionsMap.entries()].map(([value, data]) => ({ value, ...data }))
    const genres = [...genresMap.entries()].map(([value, data]) => ({ value, ...omit(data, 'items') }))
    const categories = [...categoriesMap.entries()].map(([value, data]) => ({
      value,
      ...omit(data, 'items'),
    }))
    const developers = [...developersMap.entries()].map(([value, data]) => ({
      value,
      ...omit(data, 'items'),
    }))
    const franchises = [...franchisesMap.entries()].map(([value, data]) => ({
      value,
      ...omit(data, 'items'),
    }))
    const total = [...totalMap.entries()].map(([status, data]) => ({ status, ...data }))

    return { ratings, restrictions, genres, categories, developers, franchises, total }
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
