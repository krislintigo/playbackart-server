import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(userPassword, currentPassword) {
    return bcrypt.compare(currentPassword, userPassword);
  }
}
