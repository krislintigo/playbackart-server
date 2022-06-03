import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  signToken(response: Response, payload: object): void {
    response.cookie('jwt', this.jwtService.sign(payload), {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });
  }

  resetToken(response: Response): void {
    response.cookie('jwt', '');
  }
}
