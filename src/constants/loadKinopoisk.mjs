// https://api.kinopoisk.dev/movie?field=name&search=Алим%20и%20его%20ослик&field=year&search=1978&token=ZQQ8GMN-TN54SGK-NB3MKEC-ZKB8V06
import fetch from "node-fetch";
import fs from "fs";

const items = `25-е, первый день, (1968)
38 попугаев, (1976) 
38 Попугаев. А вдруг получится!, (1978)  
38 Попугаев. Бабушка удава, (1977) 
38 Попугаев. Великое закрытие, (1985)
38 Попугаев. Завтра будет завтра, (1979)
38 Попугаев. Зарядка для хвоста, (1979)
38 Попугаев. Как лечить удава, (1977)
38 Попугаев. Куда идет Слонёнок, (1977)
38 попугаев. Ненаглядное пособие, (1991)
38 Попугаев. Привет мартышке, (1978)
Mister Пронька, (1991)`;

// convert items
const converted = items.split('\n').map(item => {
    const [name, year] = item.split(', (');
    return {
        name,
        year: year.replace(')', '').trim()
    }
})

const result = [];

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
                        image: '',
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
                        image: item.posterUrlPreview || '',
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
                console.log(i, converted.length - 1);
                if (i === converted.length - 1) {
                    fs.writeFileSync('result.json', JSON.stringify(result));
                }
            })
            .catch((err) => console.error(err));
    }, i * 2000);
}

