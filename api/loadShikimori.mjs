const Shikimori = require('shikimori-api-node');
const fs = require('fs');

const items = [];

const shiki = new Shikimori();

const getStatus = (type) => {
  switch (type) {
    case 'watching':
      return 'looking';
    case 'planned':
      return 'planned';
    case 'completed':
      return 'viewed';
    case 'dropped':
      return 'abandoned';
    default:
      return 'postponed';
  }
};

const getRestriction = (restriction) => {
  switch (restriction) {
    case 'r_plus':
      return 'NC-17';
    case 'r':
      return 'R';
    case 'pg_13':
      return 'PG-13';
    case 'pg':
      return 'PG';
    case 'g':
      return 'G';
    default:
      return 'R';
  }
};

const result = [];
for (let i = 0; i < items.length; i++) {
  setTimeout(() => {
    shiki.api.animes.get(items[i].target_id).then((res) => {
      console.log(i, res.russian || res.name || items[i].target_id);
      result.push({
        name: res?.russian || 'NAME',
        image: 'https://shikimori.one' + res?.image?.original || '',
        rating: 0,
        status: getStatus(res.status),
        type: 'series',
        restriction: getRestriction(res.rating),
        genres: ['TEMPLATE', 'Аниме'].concat(
          res.genres?.map((genre) => genre.russian) || [],
        ),
        time: {
          count: res.episodes || 1,
          duration: res.duration || 0,
        },
        year: res.aired_on?.split('-')[0] || '',
        developers: res.studios?.map((studio) => studio.name) || [],
        franchise: res.franchise || '',
      });
    });
    if (i === items.length - 1) {
      fs.writeFileSync('result.json', JSON.stringify(result));
    }
  }, 700 * i);
}

console.log(result);
