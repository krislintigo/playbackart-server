import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: UserDto) {
    return this.authService.register(user);
  }
}
