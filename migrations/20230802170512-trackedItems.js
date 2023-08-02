module.exports = {
  async up(db, client) {
    await db.collection('users').updateMany({}, { $set: { trackedItems: [] } })
  },

  async down(db, client) {
    // no need to
  },
}
