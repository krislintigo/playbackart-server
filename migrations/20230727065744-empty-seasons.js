module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany({}, { $set: { seasons: [] } })
  },

  async down(db, client) {
    // no need to
  },
}
