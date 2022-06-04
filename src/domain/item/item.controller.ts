import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
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
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.itemService.create(item, userID);
    return {
      statusCode: HttpStatus.CREATED,
      message: answers.success.item.created,
      data,
    };
  }

  @Get()
  async findAll(@Jwt('id') userID: string): Promise<answerType> {
    const data = await this.itemService.findAll(userID);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getAll,
      data,
    };
  }

  @Get('types/:type')
  async findByType(
    @Param('type') type: string,
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.itemService.findByType(userID, type);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getByType,
      data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') itemID: string,
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.itemService.findOne(userID, itemID);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.getOne,
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') itemID: string,
    @Body() item: UpdateItemDto,
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.itemService.update(item, userID, itemID);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.updated,
      data,
    };
  }

  @Delete(':id')
  async delete(
    @Param('id') itemID: string,
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    await this.itemService.delete(userID, itemID);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.deleted,
    };
  }

  @Post('load')
  async load(
    @Body(new ParseArrayPipe({ items: ItemDto, whitelist: true }))
    items: ItemDto[],
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.itemService.load(userID, items);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.item.loaded,
      data,
    };
  }
}
