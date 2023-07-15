import {app} from '../src/app'
import fs from "fs"

fs.readFile('./api/result.json', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const items = JSON.parse(data);
    const creations = items.map((item: any) => ({
      name: item.name,
      image: item.image || '',
      rating: item.rating || 0,
      status: item.status,
      type: item.type,
      restriction: item.restriction || '',
      genres: item.genres || [],
      time: {
        count: item.time.count || 1,
        duration: item.time.duration || 0,
        replays: 0
      },
      year: item.year || '',
      developers: item.developers || [],
      franchise: item.franchise || '',
      userId: '6474e01af873f22f6090936d',
    }))
    console.log(creations.length)
    await app.service('items').create(creations)
  } catch (error) {
    console.error('Ошибка при парсинге JSON:', error);
  }
});
