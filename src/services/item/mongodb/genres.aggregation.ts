export const genresAggregation = [
  { $unwind: '$genres' },
  {
    $group: {
      _id: '$genres',
      ratings: {
        $push: {
          $cond: {
            if: '$config.seasons.multipleRatings',
            then: {
              $floor: {
                $add: [{ $avg: '$seasons.rating' }, 0.5],
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
      seasonsDurations: {
        $push: {
          $map: {
            // Формируем массив продолжительностей из полей seasons
            input: '$seasons',
            as: 'season',
            in: { $multiply: ['$$season.time.count', '$$season.time.duration'] },
          },
        },
      },
      seasonsFullDurations: {
        $push: {
          $map: {
            // Формируем массив продолжительностей из полей seasons
            input: '$seasons',
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
      allDurations: { $concatArrays: ['$durations', '$seasonsDurations'] }, // Объединяем продолжительности из двух массивов
      allFullDurations: { $concatArrays: ['$fullDurations', '$seasonsFullDurations'] },
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
      genres: {
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
  { $unwind: '$genres' },
  { $replaceRoot: { newRoot: '$genres' } },
]

// PREVIOUS
// { $unwind: '$genres' },
// {
//   $group: {
//     _id: '$genres',
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
//     genres: {
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
// { $unwind: '$genres' },
// { $replaceRoot: { newRoot: '$genres' } },
