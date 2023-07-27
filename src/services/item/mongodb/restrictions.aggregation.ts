export const restrictionsAggregation = [
  {
    $group: {
      _id: '$restriction',
      count: { $sum: 1 },
    },
  },
  { $match: { _id: { $ne: '' } } },
  {
    $group: {
      _id: null,
      restrictions: { $push: { value: '$_id', count: '$count' } },
    },
  },
  { $unwind: '$restrictions' },
  { $replaceRoot: { newRoot: '$restrictions' } },
]
