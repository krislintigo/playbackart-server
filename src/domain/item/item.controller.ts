import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemService } from './services/item.service';
import { ItemDto } from './dtos/item.dto';
import { answers, answerType } from '../../constants/answers';
import { Jwt } from '../../decorators/jwt.decorator';
import { UpdateItemDto } from './dtos/update-item.dto';

@Controller('items')
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

  @Get()
  async findAll(@Jwt('id') id: string): Promise<answerType> {
    const data = await this.itemService.findAll(id);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getAll,
      data,
    };
  }

  @Get('types/:type')
  async findByType(
    @Param('type') type: string,
    @Jwt('id') id: string,
  ): Promise<answerType> {
    const data = await this.itemService.findByType(id, type);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getByType,
      data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') itemId: string,
    @Jwt('id') id: string,
  ): Promise<answerType> {
    const data = await this.itemService.findOne(id, itemId);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getOne,
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
