module.exports = {
  async up(db, client) {
    await db.collection('items').updateMany({}, { $rename: { image: 'poster' } })
  },

  async down(db, client) {
    await db.collection('items').updateMany({}, { $rename: { poster: 'image' } })
  },
}
