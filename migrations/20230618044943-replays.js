module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany({}, { $set: { 'time.replays': 0 } })
  },

  async down(db, client) {
    // not need to
  },
}
