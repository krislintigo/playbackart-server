import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import UserService from './services/user.service';
import { answers, answerType } from '../../constants/answers';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<answerType> {
    const data = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.getAll,
      data,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<answerType> {
    const data = await this.userService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.getOne,
      data,
    };
  }

  @Get('/:id/short')
  async findOneShort(@Param('id') id: string): Promise<answerType> {
    const data = await this.userService.findOneShort(id);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.getOne,
      data,
    };
  }
}
