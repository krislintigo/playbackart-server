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
