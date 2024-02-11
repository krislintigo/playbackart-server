import { type Item } from '../../src/services/item/item.schema'

export const getType = (original: string): Item['type'] => {
  switch (original) {
    case 'FILM':
      return 'movie'
    default:
      return 'movie'
  }
}

export const getRestriction = (original: string): Item['restriction'] => {
  switch (original) {
    case 'g':
      return 'G'
    case 'pg':
      return 'PG'
    case 'pg13':
      return 'PG-13'
    case 'r':
      return 'R'
    case 'nc17':
      return 'NC-17'
    default:
      return ''
  }
}

export const getGenre = (original: string) => {
  switch (original) {
    case 'аниме':
      return ''
    case 'биография':
      return 'biography'
    case 'боевик':
      return 'action'
    case 'вестерн':
      return ''
    case 'военный':
      return ''
    case 'детектив':
      return 'crime'
    case 'детский':
      return ''
    case 'документальный':
      return 'documentary'
    case 'драма':
      return 'drama'
    case 'игра':
      return ''
    case 'история':
      return 'historical'
    case 'концерт':
      return ''
    case 'короткометражка':
      return ''
    case 'комедия':
      return 'comedy'
    case 'криминал':
      return 'crime'
    case 'мелодрама':
      return ''
    case 'музыка':
      return 'musical'
    case 'мультфильм':
      return 'animation'
    case 'мюзикл':
      return 'musical'
    case 'новости':
      return ''
    case 'приключения':
      return 'adventure'
    case 'семейный':
      return ''
    case 'спорт':
      return 'sports'
    case 'триллер':
      return 'thriller'
    case 'ток-шоу':
      return ''
    case 'ужасы':
      return 'horror'
    case 'фантастика':
      return 'sci-fi'
    case 'фильм-нуар':
      return ''
    case 'фэнтези':
      return 'fantasy'
    case 'церемония':
      return ''
    default:
      return original
  }
}
