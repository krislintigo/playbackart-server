import { type Application } from '../../declarations'
import { type HookOptions } from '@feathersjs/feathers'
import { defineAbilitiesFor } from './authentication.abilities'

export const hooks: HookOptions<Application, any> = {
  after: {
    create: [
      (context) => {
        const { user } = context.result
        if (!user) return context
        const ability = defineAbilitiesFor(user)
        context.result.ability = ability
        context.result.rules = ability.rules
        return context
      },
    ],
  },
}
