import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Time } from '../schemas/item.schema';

export class ItemDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  image: string;

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

  @IsArray()
  genres: string[];

  @IsObject()
  time: Time;
}
