const Shikimori = require('shikimori-api-node');
const fs = require('fs');

const items = [
  {
    target_title: 'Made in Abyss Movie 3: Fukaki Tamashii no Reimei',
    target_id: 36862,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Black Lagoon',
    target_id: 889,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Black Lagoon: The Second Barrage',
    target_id: 1519,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: "Black Lagoon: Roberta's Blood Trail",
    target_id: 4901,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 5,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin',
    target_id: 16498,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin OVA',
    target_id: 18397,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 3,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin Season 3',
    target_id: 35760,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin: Lost Girls',
    target_id: 36106,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 3,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin Season 2',
    target_id: 25777,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin: Kuinaki Sentaku',
    target_id: 25781,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 2,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin Season 3 Part 2',
    target_id: 38524,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin: The Final Season Part 2',
    target_id: 48583,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin: The Final Season',
    target_id: 40028,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 16,
    text: null,
  },
  {
    target_title: 'Death Note',
    target_id: 1535,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 37,
    text: null,
  },
  {
    target_title: 'Neon Genesis Evangelion',
    target_id: 30,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 26,
    text: null,
  },
  {
    target_title: 'Neon Genesis Evangelion: The End of Evangelion',
    target_id: 32,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Tengen Toppa Gurren Lagann',
    target_id: 2001,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 27,
    text: null,
  },
  {
    target_title: 'Made in Abyss: Retsujitsu no Ougonkyou',
    target_id: 41084,
    target_type: 'Anime',
    score: 0,
    status: 'watching',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Made in Abyss',
    target_id: 34599,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Fullmetal Alchemist: Brotherhood',
    target_id: 5114,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 64,
    text: null,
  },
  {
    target_title: 'Akame ga Kill!',
    target_id: 22199,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 24,
    text: null,
  },
  {
    target_title: 'Sen to Chihiro no Kamikakushi',
    target_id: 199,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Goblin Slayer',
    target_id: 37349,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Tokyo Ghoul',
    target_id: 22319,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Tokyo Ghoul √A',
    target_id: 27899,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Zankyou no Terror',
    target_id: 23283,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Higashi no Eden',
    target_id: 5630,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Overlord',
    target_id: 29803,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Overlord II',
    target_id: 35073,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Overlord IV',
    target_id: 48895,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Overlord III',
    target_id: 37675,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Ookami to Koushinryou',
    target_id: 2966,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Ookami to Koushinryou II',
    target_id: 5341,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Code Geass: Hangyaku no Lelouch R2',
    target_id: 2904,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Code Geass: Hangyaku no Lelouch',
    target_id: 1575,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Monster',
    target_id: 19,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 74,
    text: null,
  },
  {
    target_title: 'Cowboy Bebop',
    target_id: 1,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 4,
    text: null,
  },
  {
    target_title: 'Mushoku Tensei: Isekai Ittara Honki Dasu Part 2',
    target_id: 45576,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
    target_id: 39535,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Odd Taxi',
    target_id: 46102,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Great Teacher Onizuka',
    target_id: 245,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 3,
    text: null,
  },
  {
    target_title: 'Kimetsu no Yaiba',
    target_id: 38000,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 26,
    text: null,
  },
  {
    target_title: 'Kimetsu no Yaiba: Mugen Ressha-hen',
    target_id: 49926,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 7,
    text: null,
  },
  {
    target_title: 'Kimetsu no Yaiba: Yuukaku-hen',
    target_id: 47778,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Howl no Ugoku Shiro',
    target_id: 431,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Kaguya-sama wa Kokurasetai? Tensai-tachi no Renai Zunousen',
    target_id: 40591,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title:
      'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen OVA',
    target_id: 43609,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen',
    target_id: 37999,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Kaguya-sama wa Kokurasetai: Ultra Romantic',
    target_id: 43608,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Kotonoha no Niwa',
    target_id: 16782,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Ijiranaide, Nagatoro-san',
    target_id: 42361,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Ijiranaide, Nagatoro-san 2nd Attack',
    target_id: 50197,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'One Punch Man',
    target_id: 30276,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'One Punch Man: Road to Hero',
    target_id: 31704,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'One Punch Man Specials',
    target_id: 31772,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 6,
    text: null,
  },
  {
    target_title: 'One Punch Man 2nd Season',
    target_id: 34134,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Perfect Blue',
    target_id: 437,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Steins;Gate',
    target_id: 9253,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 24,
    text: null,
  },
  {
    target_title: 'Ergo Proxy',
    target_id: 790,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 8,
    text: null,
  },
  {
    target_title: 'Sono Bisque Doll wa Koi wo Suru',
    target_id: 48736,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Highschool of the Dead',
    target_id: 8074,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Re:Zero kara Hajimeru Isekai Seikatsu',
    target_id: 31240,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season',
    target_id: 39587,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season Part 2',
    target_id: 42203,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Mieruko-chan',
    target_id: 48483,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Elfen Lied',
    target_id: 226,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Kiseijuu: Sei no Kakuritsu',
    target_id: 22535,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 24,
    text: null,
  },
  {
    target_title: 'Psycho-Pass',
    target_id: 13601,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 22,
    text: null,
  },
  {
    target_title: 'Boku dake ga Inai Machi',
    target_id: 31043,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'NHK ni Youkoso!',
    target_id: 1210,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 2,
    text: null,
  },
  {
    target_title: '86',
    target_id: 41457,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Tate no Yuusha no Nariagari',
    target_id: 35790,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Tate no Yuusha no Nariagari Season 2',
    target_id: 40356,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Beastars',
    target_id: 39195,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Beastars 2nd Season',
    target_id: 40935,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Beastars Final Season',
    target_id: 49469,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Mirai Nikki (TV)',
    target_id: 10620,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 26,
    text: null,
  },
  {
    target_title: 'Mirai Nikki: Redial',
    target_id: 16762,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Dorohedoro',
    target_id: 38668,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Dr. Stone',
    target_id: 38691,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 24,
    text: null,
  },
  {
    target_title: 'Dr. Stone: Stone Wars',
    target_id: 40852,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Inuyashiki',
    target_id: 34542,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Darling in the FranXX',
    target_id: 35849,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 24,
    text: null,
  },
  {
    target_title: 'Yakusoku no Neverland',
    target_id: 37779,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Yakusoku no Neverland 2nd Season',
    target_id: 39617,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Owari no Seraph',
    target_id: 26243,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Mahou Shoujo Site',
    target_id: 36266,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'BNA',
    target_id: 40060,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Aggressive Retsuko (ONA)',
    target_id: 36904,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
  {
    target_title: 'Aggressive Retsuko (ONA) 3rd Season',
    target_id: 40215,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
  {
    target_title: 'Aggressive Retsuko (ONA) 2nd Season',
    target_id: 37985,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
  {
    target_title: 'Aggressive Retsuko: We Wish You a Metal Christmas',
    target_id: 38815,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Aggressive Retsuko (ONA) 4th Season',
    target_id: 45489,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
  {
    target_title: 'Serial Experiments Lain',
    target_id: 339,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Platinum End',
    target_id: 44961,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 3,
    text: null,
  },
  {
    target_title: 'JoJo no Kimyou na Bouken (TV)',
    target_id: 14719,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 8,
    text: null,
  },
  {
    target_title: 'Soul Eater',
    target_id: 3588,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 5,
    text: null,
  },
  {
    target_title: 'Yuukoku no Moriarty',
    target_id: 40911,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Sword Art Online',
    target_id: 11757,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 25,
    text: null,
  },
  {
    target_title: 'Kimi no Na wa.',
    target_id: 32281,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Kaifuku Jutsushi no Yarinaoshi',
    target_id: 40750,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Gantz',
    target_id: 384,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Gantz:O',
    target_id: 32071,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Re:Zero kara Hajimeru Isekai Seikatsu - Hyouketsu no Kizuna',
    target_id: 38414,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Pupa',
    target_id: 19315,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Toki wo Kakeru Shoujo',
    target_id: 2236,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Shingeki no Kyojin: The Final Season - Kanketsu-hen',
    target_id: 51535,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Another',
    target_id: 11111,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: "Darwin's Game",
    target_id: 38656,
    target_type: 'Anime',
    score: 0,
    status: 'dropped',
    rewatches: 0,
    episodes: 5,
    text: null,
  },
  {
    target_title: 'Evangelion: 1.0 You Are (Not) Alone',
    target_id: 2759,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Evangelion: 2.0 You Can (Not) Advance',
    target_id: 3784,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Evangelion: 3.0 You Can (Not) Redo',
    target_id: 3785,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Evangelion: 3.0+1.0 Thrice Upon a Time',
    target_id: 3786,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Aldnoah.Zero',
    target_id: 22729,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Aldnoah.Zero 2nd Season',
    target_id: 27655,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Kimetsu no Yaiba Movie: Mugen Ressha-hen',
    target_id: 40456,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Shingeki! Kyojin Chuugakkou',
    target_id: 31374,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'One Punch Man 2nd Season Specials',
    target_id: 39705,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 6,
    text: null,
  },
  {
    target_title: 'Black Lagoon Omake',
    target_id: 8440,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 7,
    text: null,
  },
  {
    target_title: 'Re:Zero kara Hajimeru Isekai Seikatsu - Memory Snow',
    target_id: 36286,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Zero kara Hajimeru Mahou no Sho',
    target_id: 34176,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Given',
    target_id: 39533,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 11,
    text: null,
  },
  {
    target_title: 'Doukyuusei (Movie)',
    target_id: 30346,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Spy x Family',
    target_id: 50265,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Mob Psycho 100',
    target_id: 32182,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Kimetsu no Yaiba: Katanakaji no Sato-hen',
    target_id: 51019,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Noragami',
    target_id: 20507,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Noragami Aragoto',
    target_id: 30503,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Komi-san wa, Comyushou desu.',
    target_id: 48926,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Komi-san wa, Comyushou desu. 2nd Season',
    target_id: 50631,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 12,
    text: null,
  },
  {
    target_title: 'Akira',
    target_id: 47,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 1,
    text: null,
  },
  {
    target_title: 'Mousou Dairinin',
    target_id: 323,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 13,
    text: null,
  },
  {
    target_title: 'Spy x Family Part 2',
    target_id: 50602,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Chainsaw Man',
    target_id: 44511,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'One Punch Man 3',
    target_id: 52807,
    target_type: 'Anime',
    score: 0,
    status: 'planned',
    rewatches: 0,
    episodes: 0,
    text: null,
  },
  {
    target_title: 'Cyberpunk: Edgerunners',
    target_id: 42310,
    target_type: 'Anime',
    score: 0,
    status: 'completed',
    rewatches: 0,
    episodes: 10,
    text: null,
  },
];

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
        year: res.aired_on?.split('-')[0] || '1488',
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
