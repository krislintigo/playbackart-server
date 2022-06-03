import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class TimeDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  count: number;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
