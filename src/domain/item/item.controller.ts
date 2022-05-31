import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemDto } from './dtos/item.dto';
import { answers } from '../../constants/answers';
import { Jwt } from '../../decorators/jwt.decorator';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() item: ItemDto, @Jwt('id') id: string) {
    const data = this.itemService.create(item, id);
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.item.created,
      data,
    };
  }
}
