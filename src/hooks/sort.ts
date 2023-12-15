import type { HookContext } from '../declarations'

export const $sort = (pipelines: Record<string, any>) => async (context: HookContext) => {
  const customSorts = Object.entries((context.params.query.$sort ?? {}) as Record<string, 1 | -1>).filter(
    ([key, order]) => pipelines[key],
  )

  if (!customSorts.length) return

  context.params.pipeline = context.service.makeFeathersPipeline(context.params)
  context.params.customPipeline = true
  delete context.params.query.$sort

  for (const [key, order] of customSorts) {
    context.params.pipeline.splice(
      context.params.pipeline.findIndex((stage: any) => stage.$sort),
      1,
      ...pipelines[key](order),
    )
  }
}
