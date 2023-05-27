import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findOneShort(id: string): Promise<UserDocument> {
    return this.userModel.findById(id, 'id login watching');
  }

  async updateWatching(
    userID: string,
    watching: string,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userID, {
      $set: { watching },
    });
  }
}
