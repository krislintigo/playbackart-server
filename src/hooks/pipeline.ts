import { type HookContext } from '@feathersjs/feathers'

export const $pipeline = () => async (ctx: HookContext) => {
  if (!ctx.params.customPipeline) return
  console.log(ctx.params.pipeline, ctx.params.query)

  const {
    filters: { $limit: limit, $skip: skip },
    query,
  } = ctx.service.filterQuery(null, ctx.params)

  const [data, total] = await Promise.all([
    ctx.service._find({
      pipeline: ctx.params.pipeline,
      paginate: false,
    }),
    (async () => {
      const model = await ctx.service.getModel()
      return model.countDocuments(query)
    })(),
  ])

  ctx.result = { data, limit, skip, total }
}
