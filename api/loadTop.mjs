import fetch from "node-fetch";
import fs from "fs";

const result = [];

for (let page = 13; page <= 13; page++) {
  setTimeout(() => {
    fetch(
        'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?' +
        new URLSearchParams({
            type: 'TOP_250_BEST_FILMS',
            page: page,
        }),
        {
            method: 'GET',
            headers: {
                'X-API-KEY': '79c1b5a4-b204-4109-aff6-0659663f06f5',
                'Content-Type': 'application/json',
            },
        },
    )
      .then((res) => res.json())
      .then((json) => {
          for (const film of json.films) {
              console.log(page, ':', film?.nameRu);
              const [hours, minutes] = film.filmLength.split(':');
              result.push({
                  userId: '6474e01af873f22f6090936d',
                  name: film.nameRu,
                  image: film.posterUrlPreview || '',
                  rating: 0,
                  status: 'postponed',
                  type: 'movie',
                  restriction: '',
                  genres: ['TEMPLATE'].concat(film.genres?.map(genre => genre?.genre[0]?.toUpperCase() + genre?.genre?.slice(1))),
                  time: {
                      count: 1,
                      duration: +hours * 60 + +minutes,
                      replays: 0
                  },
                  year: film.year.toString() || '',
                  developers: [],
                  franchise: ''
              })
          }
        page++;
        console.log('PAGE:', page);
        if (page === json.pagesCount + 1) {
          fs.writeFileSync('result.json', JSON.stringify(result));
        }
      })
      .catch((err) => console.error(err));
  }, page * 300);
}
