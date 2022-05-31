import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { UserDto } from './dtos/user.dto';
import { answers } from '../../constants/answers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() user: UserDto, @Res() response: Response) {
    const data = await this.authService.register(user);
    response.cookie('jwt', this.jwtService.sign({ id: data.id }), {
      httpOnly: true,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.user.created,
      data,
    };
  }

  @Post('login')
  async login(@Body() user: UserDto, @Res() response: Response) {
    const data = await this.authService.login(user);
    response.cookie('jwt', this.jwtService.sign({ id: data.id }), {
      httpOnly: true,
    });
    response.send({
      statusCode: HttpStatus.OK,
      message: answers.success.user.login,
      data,
    });
  }

  @Get('validate')
  async validate(@Req() request: Request) {
    try {
      const data = await this.jwtService.verify(request.cookies?.jwt);
      console.log(data);
      return {
        statusCode: HttpStatus.OK,
        message: answers.success.user.login,
        data,
      };
    } catch (error) {
      console.log(error.message);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: answers.error.user.invalidToken,
      };
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.cookie('jwt', '');
    res.send({
      statusCode: HttpStatus.OK,
      message: answers.success.user.logout,
    });
  }
}
