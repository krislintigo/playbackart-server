import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserDto } from './dtos/user.dto';
import { answers } from '../../constants/answers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: UserDto) {
    const data = await this.authService.register(user);
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.user.created,
      data,
    };
  }

  @Post('login')
  async login(@Body() user: UserDto) {
    const data = await this.authService.login(user);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.logined,
      data,
    };
  }
}
