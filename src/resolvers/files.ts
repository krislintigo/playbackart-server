import { type HookContext } from '../declarations'
import { type NextFunction } from '@feathersjs/feathers'
import { v4 as uuid } from 'uuid'
import { get } from 'lodash'

interface FileInput {
  name: string
  key: string
  uploadedAt: string
  buffer?: string
  preview?: string
  action?: 'none' | 'copy'
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
  const service = ctx.path

  const files: Array<{ file: FileInput; path: string }> = [
    ...(ctx.data.poster ? [{ file: ctx.data.poster, path: 'poster' }] : []),
    ...(ctx.data.parts?.map((season: any, i: number) => ({
      file: season.poster,
      path: `parts.${i}.poster`,
    })) || []),
  ]

  const uploads = files
    .filter(({ file }) => file.buffer)
    .map(({ file, path }) => {
      const buffer = Buffer.from((file.buffer as string).replace(/^data:[\w/.+-]+;base64,/, ''), 'base64')
      const type = getMimeType(file.buffer as string)
      return {
        instanceKey: uuid() + '_' + file.name.replace(/\s+/g, '_').replace(/[^\w\s.]/gi, ''),
        path,
        buffer,
        type,
      }
    })

  const copies = files
    .filter(({ file }) => file.action === 'copy' && file.key)
    .map(({ file, path }) => {
      return {
        instanceKey: uuid() + '_' + file.name.replace(/\s+/g, '_').replace(/[^\w\s.]/gi, ''),
        source: file.key,
        path,
      }
    })

  files.forEach(({ file }) => {
    delete file.buffer
    delete file.preview
    delete file.action
  })

  await next()

  const instanceId = ctx.result._id as string

  await Promise.all(
    uploads.map(async (file) => {
      const Key = `${service}/${instanceId}/${file.instanceKey}`
      const uploadedAt = new Date().toISOString()
      const afterFile = get(ctx.result, file.path)
      afterFile.key = Key
      afterFile.uploadedAt = uploadedAt
      await ctx.app.service('storage').create({
        Key,
        Body: file.buffer,
        ContentType: file.type,
      })
      void ctx.service._patch(ctx.result._id, {
        $set: { [`${file.path}.key`]: Key, [`${file.path}.uploadedAt`]: uploadedAt },
      })
    }),
  )

  await Promise.all(
    copies.map(async (file) => {
      const Key = `${service}/${instanceId}/${file.instanceKey}`
      const uploadedAt = new Date().toISOString()
      const afterFile = get(ctx.result, file.path)
      afterFile.key = Key
      afterFile.uploadedAt = uploadedAt
      await ctx.app.service('storage').copy({
        Key,
        source: file.source,
      })
      void ctx.service._patch(ctx.result._id, {
        $set: { [`${file.path}.key`]: Key, [`${file.path}.uploadedAt`]: uploadedAt },
      })
    }),
  )

  if (ctx.method === 'patch') void clearAfterPatch(ctx)
}

export const clearAfterPatch = async (ctx: HookContext) => {
  if (!ctx.data.poster && !ctx.data.parts) return
  const service = ctx.path
  const instanceId = ctx.id as string
  const { Contents: data } = await ctx.app.service('storage').find({ Prefix: `${service}/${instanceId}` })
  if (!data?.length) return
  const allData = data.map((i) => i.Key).filter(Boolean) as string[]
  const usedData = [ctx.result.poster.key, ...ctx.result.parts.map((p: any) => p.poster.key)].filter(
    Boolean,
  ) as string[]
  const removables = allData.filter((i) => !usedData.includes(i))
  if (!removables.length) return
  await ctx.app.service('storage').remove(removables)
}

export const clearAfterRemove = async (ctx: HookContext) => {
  const service = ctx.path
  const instanceId = ctx.id as string
  const { Contents: removables } = await ctx.app
    .service('storage')
    .find({ Prefix: `${service}/${instanceId}` })
  if (!removables?.length) return
  await ctx.app.service('storage').remove(removables.map((i) => i.Key as string))
}
