import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TimeDto } from './time.dto';
import { Type } from 'class-transformer';

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
  @IsString({ each: true })
  genres: string[];

  @IsOptional()
  @Type(() => TimeDto)
  @ValidateNested()
  time: TimeDto;

  @IsOptional()
  @IsString()
  year: string;

  @IsOptional()
  @IsString({ each: true })
  developer: string[];
}
