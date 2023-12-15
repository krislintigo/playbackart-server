export const timeSortPipeline = (sortOrder: 1 | -1) => [
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

export const ratingSortPipeline = (sortOrder: 1 | -1) => [
  {
    $addFields: {
      calculatedRating: {
        $cond: {
          if: '$config.parts.multipleRatings',
          // then: { $avg: '$parts.rating' },
          then: { $floor: { $add: [{ $avg: '$parts.rating' }, 0.5] } },
          else: '$rating',
        },
      },
    },
  },
  { $sort: { calculatedRating: sortOrder, name: 1 } },
  { $project: { calculatedRating: 0 } },
]
