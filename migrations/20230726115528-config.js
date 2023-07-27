module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany(
      {},
      {
        $set: {
          config: {
            seasons: {
              extended: false,
              multiplePosters: false,
              multipleRatings: false,
              multipleDevelopers: false,
            },
          },
        },
      },
    )
  },

  async down(db, client) {
    // not need to
  },
}
