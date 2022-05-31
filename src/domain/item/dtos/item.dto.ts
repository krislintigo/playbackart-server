import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Time } from '../schemas/item.schema';

export class ItemDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  restriction: string;

  @IsOptional()
  @IsArray()
  genres: string[];

  @IsOptional()
  @IsObject()
  time: Time;
}
