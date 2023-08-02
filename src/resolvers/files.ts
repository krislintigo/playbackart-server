import { type HookContext } from '../declarations'
import { type NextFunction } from '@feathersjs/feathers'
import { v4 as uuid } from 'uuid'

export const returnObjectByPath = (from: any, path: string) => {
  const fields = path.split('.')
  let returned = from
  for (const field of fields) {
    if (!returned) return
    returned = returned[field]
  }
  return returned
}

export const getMimeType = (input: string) => {
  const startMarker = 'data:'
  const endMarker = ';base64,'
  const start = input.indexOf(startMarker)
  const end = input.indexOf(endMarker)
  if (start === -1 || end === -1) return ''
  return input.substring(start + startMarker.length, end)
}

export const postersUpload = async (ctx: HookContext, next: NextFunction) => {
  console.log('DATA', ctx.data)
  const service = ctx.path
  const uploads = [
    { file: ctx.data.poster, path: 'poster' },
    ...(ctx.data.parts?.map((season: any, i: number) => ({
      file: season.poster,
      path: `parts.${i}.poster`,
    })) || []),
  ]
    .filter(({ file }) => {
      if (!file) return false
      delete file.preview
      if (!file.buffer) {
        delete file.buffer
        return false
      }
      return true
    })
    .map(({ file, path }) => {
      const buffer = Buffer.from(file.buffer.replace(/^data:[\w/.+-]+;base64,/, ''), 'base64')
      const type = getMimeType(file.buffer)
      delete file.buffer
      file.uploadedAt = new Date().toISOString()
      return {
        instanceKey: uuid() + '_' + file.name?.replace(/\s+/g, '_').replace(/[^\w\s.]/gi, ''),
        path,
        buffer,
        type,
      }
    })

  // remove old image if exists
  // if (ctx.method === 'patch') {
  //   ctx.service._get(ctx.id).then((item: any) => {
  //     const fileToRemove = returnObjectByPath(item, path)
  //     void ctx.app.service('aws-s3').remove(fileToRemove.key)
  //   })
  // }

  console.log(uploads)

  await next()

  console.time('save aws')
  await Promise.all(
    uploads.map(async (file) => {
      const instanceId = ctx.result._id as string
      const Key = `${service}/${instanceId}/${file.instanceKey}`
      const afterFile = returnObjectByPath(ctx.result, file.path)
      afterFile.key = Key
      // single create for all uploads
      await ctx.app.service('storage').create({
        Key,
        Body: file.buffer,
        ContentType: file.type,
      })
      void ctx.service._patch(ctx.result._id, {
        $set: { [`${file.path}.key`]: Key },
      })
    }),
  )
  console.timeEnd('save aws')
}

export const clearAfterRemove = async (ctx: HookContext) => {
  const service = ctx.path
  const instanceId = ctx.result._id as string
  await ctx.app.service('storage').remove(`${service}/${instanceId}`)
}
