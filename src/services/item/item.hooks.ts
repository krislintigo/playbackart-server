import { type HookContext } from '../../declarations'

export const emitCUD = (context: HookContext) => {
  context.event = null
  context.service.emit('cud', context.result)
}
