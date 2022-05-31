import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { ItemDto } from '../dtos/item.dto';
import { UpdateItemDto } from '../dtos/update-item.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(item: ItemDto, id: string) {
    const user = await this.userModel.findById(id);
    user.items.push({ id: new mongoose.Types.ObjectId(), ...item });
    await user.save();
    return user;
  }

  async update(item: UpdateItemDto, id: string) {
    // const user = await this.userModel.findById(id);
    // const index = user.items.findIndex((i) => i.id === item.id);
    // user.items[index] = item;
    // await user.save();
    // return user;
  }
}
