import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TimeDto } from './time.dto';
import { Type } from 'class-transformer';

export class ItemDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsString()
  restriction: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsNotEmpty()
  @Type(() => TimeDto)
  @ValidateNested()
  time: TimeDto;

  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString({ each: true })
  developers: string[];

  @IsString()
  franchise: string;
}
