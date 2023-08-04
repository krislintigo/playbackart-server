import { type HookContext } from '../../declarations'

export const timeSort = (ctx: HookContext) => {
  const timeSort: number | undefined = ctx.params.query.$sort?.time
  if (!timeSort) return
  const pipeline = ctx.app.service('items').makeFeathersPipeline(ctx.params)
  for (let i = 0; i < pipeline.length; i++) {
    if (!pipeline[i].$sort) continue
    pipeline[i] = [
      {
        $addFields: {
          calculatedTime: {
            $add: [
              { $multiply: ['$time.count', '$time.duration'] },
              {
                $sum: {
                  $map: {
                    input: '$parts',
                    as: 'part',
                    in: { $multiply: ['$$part.time.count', '$$part.time.duration'] },
                  },
                },
              },
            ],
          },
        },
      },
      { $sort: { calculatedTime: timeSort } },
      { $project: { calculatedTime: 0 } },
    ]
  }
  ctx.params.pipeline = pipeline.flat(1)
}
