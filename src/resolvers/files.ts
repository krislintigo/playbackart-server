import { type HookContext } from '../declarations'
import { type NextFunction } from '@feathersjs/feathers'

export const returnObjectByPath = (from: any, path: string) => {
  const fields = path.split('.')
  let returned = from
  for (const field of fields) {
    if (!returned) return
    returned = returned[field]
  }
  return returned
}

export const fileUpload = (path: string) => async (ctx: HookContext, next: NextFunction) => {
  const file = returnObjectByPath(ctx.data, path)
  // console.log(file)
  if (!file?.buffer) {
    await next()
    return
  }
  const service = ctx.path
  const name = file.name as string
  const namedKey = Date.now() + '_' + file.name?.replace(/\s+/g, '_').replace(/[^\w\s.]/gi, '')
  const buffer = Buffer.from(file.buffer.replace(/^data:[\w/.+-]+;base64,/, ''), 'base64')
  // const type = file.type as string

  delete file.buffer
  file.name = name
  // file.key = namedKey
  file.uploadedAt = new Date().toISOString()

  // remove old image if exists
  // if (ctx.method === 'patch') {
  //   ctx.service._get(ctx.id).then((item: any) => {
  //     const fileToRemove = returnObjectByPath(item, path)
  //     void ctx.app.service('aws-s3').remove(fileToRemove.key)
  //   })
  // }

  await next()

  const instanceId = ctx.result._id as string
  const Key = `${service}/${instanceId}/${namedKey}`
  const afterFile = returnObjectByPath(ctx.result, path)
  afterFile.key = Key
  await ctx.app.service('storage').create({
    Key,
    Body: buffer,
  })
  void ctx.service._patch(ctx.result._id, {
    $set: { [path + '.key']: Key },
  })
}
