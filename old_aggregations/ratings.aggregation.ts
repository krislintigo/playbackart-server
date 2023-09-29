export const ratingsAggregation = [
  {
    $addFields: {
      selectedRatings: {
        $cond: [{ $eq: ['$config.parts.multipleRatings', true] }, '$parts.rating', ['$rating']],
      },
    },
  },
  { $unwind: '$selectedRatings' },
  {
    $group: {
      _id: '$selectedRatings',
      count: { $sum: 1 },
    },
  },
  { $match: { _id: { $ne: 0 } } },
  {
    $project: {
      _id: 0,
      value: '$_id',
      count: 1,
    },
  },
]
