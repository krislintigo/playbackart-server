export const franchisesAggregation = [
  {
    $group: {
      _id: '$franchise',
      ratings: {
        $push: {
          $cond: {
            if: '$config.parts.multipleRatings',
            // then: '$parts.rating',
            then: {
              $floor: {
                $add: [{ $avg: '$parts.rating' }, 0.5],
              },
            },
            else: '$rating',
          },
        },
      },
      durations: { $push: { $multiply: ['$time.count', '$time.duration'] } },
      fullDurations: {
        $push: { $multiply: [{ $add: ['$time.replays', 1] }, '$time.count', '$time.duration'] },
      },
      count: { $sum: 1 },
      partsDurations: {
        $push: {
          $map: {
            // Формируем массив продолжительностей из полей parts
            input: '$parts',
            as: 'season',
            in: { $multiply: ['$$season.time.count', '$$season.time.duration'] },
          },
        },
      },
      partsFullDurations: {
        $push: {
          $map: {
            // Формируем массив продолжительностей из полей parts
            input: '$parts',
            as: 'season',
            in: {
              $multiply: [
                { $add: ['$$season.time.replays', 1] },
                '$$season.time.count',
                '$$season.time.duration',
              ],
            },
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      value: '$_id',
      ratings: 1,
      durations: 1,
      fullDurations: 1,
      count: 1,
      allDurations: { $concatArrays: ['$durations', '$partsDurations'] }, // Объединяем продолжительности из двух массивов
      allFullDurations: { $concatArrays: ['$fullDurations', '$partsFullDurations'] },
    },
  },
  // Сглаживаем массивы продолжительностей
  {
    $project: {
      value: 1,
      ratings: {
        $reduce: {
          input: '$ratings',
          initialValue: [],
          in: {
            $concatArrays: [
              '$$value',
              { $cond: { if: { $isArray: '$$this' }, then: '$$this', else: ['$$this'] } },
            ],
          },
        },
      },
      allDurations: {
        $reduce: {
          input: '$allDurations',
          initialValue: [],
          in: {
            $concatArrays: [
              '$$value',
              { $cond: { if: { $isArray: '$$this' }, then: '$$this', else: ['$$this'] } },
            ],
          },
        },
      },
      allFullDurations: {
        $reduce: {
          input: '$allFullDurations',
          initialValue: [],
          in: {
            $concatArrays: [
              '$$value',
              { $cond: { if: { $isArray: '$$this' }, then: '$$this', else: ['$$this'] } },
            ],
          },
        },
      },
      count: 1,
    },
  },
  {
    $addFields: {
      ratings: { $filter: { input: '$ratings', cond: { $ne: ['$$this', 0] } } },
      allDurations: { $filter: { input: '$allDurations', cond: { $ne: ['$$this', 0] } } },
      allFullDurations: { $filter: { input: '$allFullDurations', cond: { $ne: ['$$this', 0] } } },
    },
  },
  {
    $group: {
      _id: null,
      franchises: {
        $push: {
          value: '$value',
          ratings: '$ratings',
          durations: '$allDurations',
          fullDurations: '$allFullDurations',
          count: '$count',
        },
      },
    },
  },
  { $unwind: '$franchises' },
  { $replaceRoot: { newRoot: '$franchises' } },
]

// PREVIOUS
// {
//   $group: {
//     _id: '$franchise',
//     ratings: { $push: '$rating' },
//     durations: { $push: { $multiply: ['$time.count', '$time.duration'] } },
//     fullDurations: {
//       $push: { $multiply: [{ $add: ['$time.replays', 1] }, '$time.count', '$time.duration'] },
//     },
//     count: { $sum: 1 },
//   },
// },
// {
//   $group: {
//     _id: null,
//     franchises: {
//       $push: {
//         value: '$_id',
//         ratings: '$ratings',
//         durations: '$durations',
//         fullDurations: '$fullDurations',
//         count: '$count',
//       },
//     },
//   },
// },
// { $unwind: '$franchises' },
// { $replaceRoot: { newRoot: '$franchises' } },
