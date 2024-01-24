import type { HookContext } from '../declarations'
import { type Document } from 'mongodb'

type SortPipeline = Record<string, (order: 1 | -1) => Document[]>

export const $sort = (pipelines: SortPipeline) => async (context: HookContext) => {
  const customSorts = Object.entries((context.params.query.$sort ?? {}) as Record<string, 1 | -1>).filter(
    ([key, order]) => pipelines[key],
  )

  if (!customSorts.length) return

  delete context.params.query.$sort

  const pipeline = []

  const { query } = context.service.filterQuery(null, context.params)
  if (Object.keys(query).length > 0) {
    pipeline.unshift({ $match: query })
  }

  for (const [key, order] of customSorts) {
    pipeline.push(...pipelines[key](order))
  }

  context.params.pipeline = pipeline
  context.params.customPipeline = true
}
