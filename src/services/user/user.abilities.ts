import { type CaslAbilityBuilder } from '../authentication/authentication.abilities'

export const setupUserAbilities = ({ user, can }: CaslAbilityBuilder) => {
  can('create', 'users')
  can(['read', 'update', 'delete'], 'users', { _id: user._id })
}
