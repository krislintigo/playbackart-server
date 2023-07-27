export const totalAggregation = [
  {
    $addFields: {
      totalDuration: {
        $add: [
          { $multiply: ['$time.count', '$time.duration'] },
          {
            $reduce: {
              input: '$seasons',
              initialValue: 0,
              in: {
                $add: ['$$value', { $multiply: ['$$this.time.count', '$$this.time.duration'] }],
              },
            },
          },
        ],
      },
      totalFullDuration: {
        $add: [
          { $multiply: [{ $add: ['$time.replays', 1] }, '$time.count', '$time.duration'] },
          {
            $reduce: {
              input: '$seasons',
              initialValue: 0,
              in: {
                $add: [
                  '$$value',
                  {
                    $multiply: [
                      { $add: ['$$this.time.replays', 1] },
                      '$$this.time.count',
                      '$$this.time.duration',
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
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      duration: { $sum: '$totalDuration' },
      fullDuration: { $sum: '$totalFullDuration' },
    },
  },
  {
    $project: {
      _id: 0,
      status: '$_id',
      count: 1,
      duration: 1,
      fullDuration: 1,
    },
  },
]
