import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { ItemDto } from '../dtos/item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { answers } from '../../../constants/answers';

@Injectable()
export class ItemService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(item: ItemDto, id: string) {
    const user = await this.userModel.findById(id);
    user.items.push({
      id: new Types.ObjectId().toHexString(),
      ...item,
    });
    return await user.save();
  }

  async findAll(userID: string) {
    const user = await this.userModel.findById(userID);
    return user.items;
  }

  async findByType(userID: string, type: string) {
    const user = await this.userModel.findById(userID);
    return user.items.filter((i) => i.type === type);
  }

  async findOne(userID: string, itemID: string) {
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
    const user = await this.userModel.findById(id);
    const itemIndex = user.items.findIndex((i) => i.id === item.id);
    if (itemIndex === -1) {
      throw new NotFoundException(answers.error.item.notFound);
    }
    user.items[itemIndex] = {
      ...user.items[itemIndex],
      ...item,
    };
    return await user.save();
  }
}
