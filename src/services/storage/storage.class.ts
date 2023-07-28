// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

type Storage = any
interface StorageData {
  Key: string
  Body: any
}
type StoragePatch = any
type StorageQuery = any

export type { Storage, StorageData, StoragePatch, StorageQuery }

export interface StorageServiceOptions {
  app: Application
}

export interface StorageParams extends Params<StorageQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class StorageService<ServiceParams extends StorageParams = StorageParams>
  implements ServiceInterface<Storage, StorageData, ServiceParams, StoragePatch>
{
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

  // async find(_params?: ServiceParams): Promise<Storage[]> {
  //   return []
  // }

  async get(id: Id, _params?: ServiceParams): Promise<Storage> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`,
    }
  }

  async create({ Key, Body }: StorageData, params?: ServiceParams): Promise<Storage> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key,
      Body,
      // ContentType: 'plain/text',
    })
    const res = await this.s3Client.send(command)
    console.log(res)
  }

  // // This method has to be added to the 'methods' option to make it available to clients
  // async update(id: NullableId, data: StorageData, _params?: ServiceParams): Promise<Storage> {
  //   return {
  //     id: 0,
  //     ...data,
  //   }
  // }

  // async patch(id: NullableId, data: StoragePatch, _params?: ServiceParams): Promise<Storage> {
  //   return {
  //     id: 0,
  //     text: `Fallback for ${id}`,
  //     ...data,
  //   }
  // }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Storage> {
    return {
      id: 0,
      text: 'removed',
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
