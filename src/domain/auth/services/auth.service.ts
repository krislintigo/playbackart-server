import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from '../dtos/user.dto';
import { PasswordService } from './password.service';
import { answers } from '../../../constants/answers';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  async register({ login, password }: UserDto): Promise<UserDocument> {
    const isAlreadyExist = await this.userModel.findOne({ login });
    if (isAlreadyExist) {
      throw new HttpException(
        answers.error.user.alreadyExists,
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = new this.userModel({ login, password: hashedPassword });
    return await createdUser.save();
  }

  async login({ login, password }: UserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ login });
    if (!user) {
      throw new HttpException(
        answers.error.user.notFound,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordValid = await this.passwordService.comparePasswords(
      user.password,
      password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        answers.error.user.badCredentials,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
