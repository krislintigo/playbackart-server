import { Ability, AbilityBuilder, createAliasResolver } from '@casl/ability'
import { type User } from '../user/user.schema'
import { setupUserAbilities } from '../user/user.abilities'
import { setupItemAbilities } from '../item/item.abilities'

export interface CaslAbilityBuilder {
  user: User
  can: any
  cannot: any
}

const resolveAction = createAliasResolver({
  update: 'patch',
  read: ['get', 'find'],
  delete: 'remove',
})

export const defineRulesFor = (user: User) => {
  const { can, cannot, rules } = new AbilityBuilder(Ability)
  setupUserAbilities({ user, can, cannot })
  setupItemAbilities({ user, can, cannot })
  return rules
}

export const defineAbilitiesFor = (user: User) => {
  const rules = defineRulesFor(user)
  return new Ability(rules, { resolveAction })
}
