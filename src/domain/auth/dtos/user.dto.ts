import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  login: string;

  @IsNotEmpty()
  password: string;
}
