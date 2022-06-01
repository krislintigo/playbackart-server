import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { ItemDto } from '../dtos/item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { answers } from '../../../constants/answers';
import { Item } from '../schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(item: ItemDto, userID: string): Promise<ItemDto> {
    const newItem = { id: new Types.ObjectId().toHexString(), ...item };
    await this.userModel.updateOne(
      { _id: userID },
      { $push: { items: newItem } },
    );
    return newItem;
  }

  async findAll(userID: string): Promise<Item[]> {
    const user = await this.userModel.findById(userID);
    return user.items;
  }

  async findByType(userID: string, type: string): Promise<Item[]> {
    const user = await this.userModel.findById(userID);
    return user.items.filter((item) => item.type === type);
  }

  async findOne(userID: string, itemID: string): Promise<Item> {
    const user = await this.userModel.findOne(
      { _id: userID },
      { items: { $elemMatch: { id: itemID } } },
    );
    if (!user.items[0]) {
      throw new NotFoundException(answers.error.item.notFound);
    }
    return user.items[0];
  }

  async update(
    item: UpdateItemDto,
    userID: string,
    itemID: string,
  ): Promise<Item> {
    const oldItem = await this.findOne(userID, itemID);
    const newItem = { ...oldItem, ...item };
    await this.userModel.updateOne(
      { _id: userID, 'items.id': itemID },
      { $set: { 'items.$': { ...newItem } } },
    );
    return newItem;
  }

  async delete(userID: string, itemID: string) {
    await this.findOne(userID, itemID);
    await this.userModel.updateOne(
      { _id: userID },
      { $pull: { items: { id: itemID } } },
    );
  }

  async load(userID: string, data: ItemDto[]): Promise<ItemDto[]> {
    const items = data.map((i) => ({
      id: new Types.ObjectId().toHexString(),
      ...i,
    }));
    await this.userModel.updateOne({ _id: userID }, { $set: { items } });
    return data;
  }
}
