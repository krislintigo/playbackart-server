import { IsString } from 'class-validator';

export class UpdateWatchingDto {
  @IsString()
  watching: string;
}
