import { type Document } from 'mongodb'

export const timeSortPipeline = (sortOrder: 1 | -1): Document[] => [
  {
    $addFields: {
      calculatedTime: {
        $sum: [
          {
            $add: [{ $multiply: ['$time.count', '$time.duration'] }, { $sum: '$time.sessions.duration' }],
          },
          {
            $reduce: {
              input: '$parts',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $add: [
                      { $multiply: ['$$this.time.count', '$$this.time.duration'] },
                      { $sum: '$$this.time.sessions.duration' },
                    ],
                  },
                ],
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

export const ratingSortPipeline = (sortOrder: 1 | -1): Document[] => [
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
