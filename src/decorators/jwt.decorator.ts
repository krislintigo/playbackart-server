import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { serverConfig } from '../server.config';
import { answers } from '../constants/answers';
import { JwtService } from '@nestjs/jwt';

export const Jwt = createParamDecorator(
  (field: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.cookies?.jwt;
    const jwtService = new JwtService({});
    try {
      const userData = jwtService.verify(token, {
        secret: serverConfig.jwt.secret,
      });
      console.log('data from decorator', userData);
      return field ? userData[field] : { id: userData.id };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        answers.error.user.invalidToken,
        HttpStatus.UNAUTHORIZED,
      );
    }
  },
);
