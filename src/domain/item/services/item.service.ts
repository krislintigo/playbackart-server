import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { ItemDto } from '../dtos/item.dto';

@Injectable()
export class ItemService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(item: ItemDto, id: string) {
    const user = await this.userModel.findById(id);
    user.items.push(item);
    await user.save();
    return user;
  }
}
