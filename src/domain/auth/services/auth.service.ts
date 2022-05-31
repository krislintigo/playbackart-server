import {
  BadRequestException,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
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
    const isAlreadyExist = await this.userModel.findOne({ login }, 'login');
    if (isAlreadyExist) {
      throw new BadRequestException(answers.error.user.alreadyExists);
    }
    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = new this.userModel({ login, password: hashedPassword });
    return await createdUser.save();
  }

  async login({ login, password }: UserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ login }, 'login password');
    console.log(user);
    if (!user) {
      throw new BadRequestException(answers.error.user.notFound);
    }
    const isPasswordValid = await this.passwordService.comparePasswords(
      user.password,
      password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(answers.error.user.badCredentials);
    }
    return user;
  }
}
