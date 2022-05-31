import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from '../dtos/user.dto';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  async register({ login, password }: UserDto): Promise<UserDocument> {
    const isAlreadyExist = await this.userModel.findOne({ login });
    if (isAlreadyExist) {
      throw new Error('User already exist');
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = new this.userModel({ login, password: hashedPassword });
    return await createdUser.save();
  }
}
