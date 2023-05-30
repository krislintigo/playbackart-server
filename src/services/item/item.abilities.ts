import { type CaslAbilityBuilder } from '../authentication/authentication.abilities'

export const setupItemAbilities = ({ user, can }: CaslAbilityBuilder) => {
  can(['create', 'update', 'delete'], 'items', { userId: user._id })
  can('read', 'items')
}
