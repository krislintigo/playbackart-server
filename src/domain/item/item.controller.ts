import { Body, Controller, HttpStatus, Post, Put } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemDto } from './dtos/item.dto';
import { answers, answerType } from '../../constants/answers';
import { Jwt } from '../../decorators/jwt.decorator';
import { UpdateItemDto } from './dtos/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async create(
    @Body() item: ItemDto,
    @Jwt('id') id: string,
  ): Promise<answerType> {
    const data = await this.itemService.create(item, id);
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.item.created,
      data,
    };
  }

  @Put()
  async update(
    @Body() item: UpdateItemDto,
    @Jwt('id') id: string,
  ): Promise<answerType> {
    const data = await this.itemService.update(item, id);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.updated,
      data,
    };
  }
}
