import {app} from '../src/app'
import fs from "fs"

const updateStatus = (status: string) => {
  switch (status) {
    case 'looking':
      return 'in-process'
    case 'viewed':
      return 'completed'
    default:
      return status
  }
}

fs.readFile('./api/backup.txt', 'utf8', async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  try {
    const json = JSON.parse(data);
    const items = json.data
    const creations = items.map((item: any) => ({
      name: item.name,
      image: item.image || '',
      rating: item.rating || 0,
      status: updateStatus(item.status),
      type: item.type,
      restriction: item.restriction || '',
      genres: item.genres || [],
      time: {
        count: item.time.count || 1,
        duration: item.time.duration || 0,
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
