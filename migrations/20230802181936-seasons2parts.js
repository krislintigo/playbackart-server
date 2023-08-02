module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany(
      {},
      {
        $rename: {
          'config.seasons': 'config.parts',
          seasons: 'parts',
        },
      },
    )
  },

  async down(db, client) {
    await db.collection('items').updateMany(
      {},
      {
        $rename: {
          'config.parts': 'config.seasons',
          parts: 'seasons',
        },
      },
    )
  },
}
