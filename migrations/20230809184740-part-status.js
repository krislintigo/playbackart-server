module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany({}, { $set: { 'parts.$[].status': 'completed' } })
  },

  async down(db, client) {
    // not need to
  },
}
