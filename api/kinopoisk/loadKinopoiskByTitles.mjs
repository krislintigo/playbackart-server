// https://api.kinopoisk.dev/movie?field=name&search=Алим%20и%20его%20ослик&field=year&search=1978&token=ZQQ8GMN-TN54SGK-NB3MKEC-ZKB8V06
import fs from "fs";

const items = ``;

// convert items
const converted = items.split('\n').map(item => {
    const [name, year] = item.split(', (');
    return {
        name,
        year: year.replace(')', '').trim()
    }
})

const result = [];
let counter = 0;

for (let i = 0; i < converted.length; i++) {
    setTimeout(() => {
        fetch(
            'https://kinopoiskapiunofficial.tech/api/v2.2/films?' +
            new URLSearchParams({
                yearFrom: converted[i].year,
                yearTo: converted[i].year,
                keyword: converted[i].name
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
                const item = json?.items?.at(0);
                console.log(i, ':', item?.nameRu, '%', converted[i].name);
                if (!item) {
                    result.push({
                        name: converted[i].name + ' (not found)',
                        poster: '',
                        rating: 0,
                        status: 'postponed',
                        type: 'movie',
                        restriction: '',
                        genres: ['TEMPLATE'],
                        time: {
                            count: 1,
                            duration: 0
                        },
                        year: '',
                        developers: ['Союзмультфильм'],
                        franchise: ''
                    })
                } else {
                    result.push({
                        name: json.total > 1 ? converted[i].name + ' %% ' + item.nameRu : item.nameRu,
                        poster: item.posterUrlPreview || '',
                        rating: 0,
                        status: 'postponed',
                        type: 'movie',
                        restriction: '',
                        genres: ['TEMPLATE'].concat(item.genres?.map(genre => genre?.genre[0]?.toUpperCase() + genre?.genre?.slice(1))),
                        time: {
                            count: 1,
                            duration: 0
                        },
                        year: item.year.toString() || '',
                        developers: ['Союзмультфильм'],
                        franchise: ''
                    })
                }
                counter++;
                console.log(counter, '/', converted.length);
                if (counter === converted.length - 1) {
                    fs.writeFileSync('result.json', JSON.stringify(result));
                }
            })
            .catch((err) => console.error(err));
    }, i * 200);
}

