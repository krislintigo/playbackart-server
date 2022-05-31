import { IsNotEmpty, IsNumber } from 'class-validator';

export class TimeDto {
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
