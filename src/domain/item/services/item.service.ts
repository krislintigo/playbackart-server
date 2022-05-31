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

  async create(item: ItemDto, id: string): Promise<ItemDto> {
    await this.userModel.updateOne(
      { _id: id },
      { $push: { items: { ...item, id: new Types.ObjectId().toHexString() } } },
    );
    return item;
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
      {
        items: { $elemMatch: { id: itemID } },
      },
    );
    if (!user.items[0]) {
      throw new NotFoundException(answers.error.item.notFound);
    }
    return user.items[0];
  }

  async update(item: UpdateItemDto, id: string) {
    const updatedItem = await this.findOne(id, item.id);
    await this.userModel.updateOne(
      { _id: id, 'items.id': item.id },
      { $set: { 'items.$': { ...updatedItem, ...item } } },
    );
    return { ...updatedItem, ...item };
  }
}
