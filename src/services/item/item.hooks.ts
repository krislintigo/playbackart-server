import { type HookContext } from '../../declarations'

const getTimeSortPipeline = (sortOrder: 1 | -1) => [
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
  { $sort: { calculatedTime: sortOrder, name: 1 } },
  { $project: { calculatedTime: 0 } },
]

const getRatingSortPipeline = (sortOrder: 1 | -1) => [
  {
    $addFields: {
      calculatedRating: {
        $cond: {
          if: '$config.parts.multipleRatings',
          then: { $floor: { $add: [{ $avg: '$parts.rating' }, 0.5] } },
          else: '$rating',
        },
      },
    },
  },
  { $sort: { calculatedRating: sortOrder, name: 1 } },
  { $project: { calculatedRating: 0 } },
]

export const $sort = async (ctx: HookContext) => {
  const timeSort: 1 | -1 | undefined = ctx.params.query.$sort?.time
  const ratingSort: 1 | -1 | undefined = ctx.params.query.$sort?.rating
  if (!timeSort && !ratingSort) return

  const {
    filters: { $limit: limit, $skip: skip },
    query,
  } = ctx.app.service('items').filterQuery(null, ctx.params)
  const pipeline = ctx.app.service('items').makeFeathersPipeline(ctx.params)

  const index = pipeline.findIndex((stage) => stage.$sort)

  if (timeSort) {
    pipeline.splice(
      pipeline.findIndex((stage) => stage.$sort),
      1,
      ...getTimeSortPipeline(timeSort),
    )
  } else if (ratingSort) {
    pipeline.splice(
      pipeline.findIndex((stage) => stage.$sort),
      1,
      ...getRatingSortPipeline(ratingSort),
    )
  }

  const [data, total] = await Promise.all([
    ctx.app.service('items')._find({
      pipeline,
      paginate: false,
    }),
    ctx.app
      .service('items')
      .getModel()
      .then(async (col) => await col.countDocuments(query)),
  ])
  ctx.result = { data, limit, skip, total }
}
