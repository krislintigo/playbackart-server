import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { ItemDto } from './dtos/item.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async push(userID: string, data: ItemDto[]): Promise<ItemDto[]> {
    const items = data.map((i) => ({
      id: new Types.ObjectId().toHexString(),
      ...i,
    }));
    await this.userModel.updateOne(
      { _id: userID },
      { $push: { items: { $each: items } } },
    );
    return data;
  }

  async clear(userID: string): Promise<void> {
    await this.userModel.updateOne({ _id: userID }, { $set: { items: [] } });
  }

  async fix(userID: string): Promise<void> {
    //
  }
}
