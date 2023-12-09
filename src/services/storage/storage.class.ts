// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Params } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  type PutObjectAclCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { get, isNil } from 'lodash'
import dayjs from 'dayjs'

type Storage = any
interface StorageData {
  Key: string
  Body: any
  ContentType: string
}
type StoragePatch = any
type StorageQuery = any

export type { Storage, StorageData, StoragePatch, StorageQuery }

export interface StorageServiceOptions {
  app: Application
}

export interface StorageParams extends Params<StorageQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class StorageService<ServiceParams extends StorageParams = StorageParams> {
  private readonly s3Client: S3Client
  private readonly bucket: string
  constructor(public options: StorageServiceOptions) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true,
      region: process.env.S3_REGION,
      apiVersion: 'latest',
    })
    this.bucket = process.env.S3_BUCKET as string
  }

  async get(id: string, _params?: ServiceParams): Promise<Storage> {
    // Create the getCommand
    const getCommand = new GetObjectCommand({
      Bucket: this.bucket,
      Key: id,
    })
    console.log('getting', id)
    const result = await this.s3Client.send(getCommand)
    console.log(result)
    const headers = {
      'Accept-Ranges': result.AcceptRanges,
      'Cache-Control': result.CacheControl,
      Expires: result.Expires,
      'Content-Disposition': result.ContentDisposition,
      'Content-Encoding': result.ContentEncoding,
      'Content-Language': result.ContentLanguage,
      'Content-Length': result.ContentLength,
      'Content-Range': result.ContentRange,
      'Content-Type': result.ContentType,
      ETag: result.ETag,
      'Last-Modified': result.LastModified,
    }
    const keys = Object.keys(headers) as Array<keyof typeof headers>
    keys.forEach((key) => {
      const value = headers[key]
      if (isNil(value)) delete headers[key]
      else if (value instanceof Date) {
        // @ts-expect-error
        headers[key] = dayjs(value).format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
      }
    })
    return { file: result.Body, headers, status: get(result, '$metadata.httpStatusCode', 200) }
  }

  async create(
    { Key, Body, ContentType }: StorageData,
    _params?: ServiceParams,
  ): Promise<PutObjectAclCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key,
      Body,
      ContentType,
    })
    return await this.s3Client.send(command)
  }

  async find({ Prefix }: { Prefix: string }, _params?: ServiceParams) {
    const listCommand = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix,
    })
    return await this.s3Client.send(listCommand)
  }

  async copy({ source, Key }: { source: string; Key: string }, _params?: ServiceParams) {
    const command = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `/${this.bucket}/${source}`,
      Key,
    })
    return await this.s3Client.send(command)
  }

  async remove(keys: string[], _params?: ServiceParams) {
    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: { Quiet: false, Objects: keys.map((key) => ({ Key: key })) },
    })
    return await this.s3Client.send(command)
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
