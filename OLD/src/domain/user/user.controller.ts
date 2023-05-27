import { Body, Controller, Get, HttpStatus, Param, Put } from '@nestjs/common';
import UserService from './user.service';
import { answers, answerType } from '../../constants/answers';
import { Jwt } from '../../decorators/jwt.decorator';
import { UpdateWatchingDto } from './dtos/update-watching.dto';

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

  @Put('/update-watching')
  async updateWatching(
    @Body() body: UpdateWatchingDto,
    @Jwt('id') userID: string,
  ): Promise<answerType> {
    const data = await this.userService.updateWatching(userID, body.watching);
    return {
      statusCode: HttpStatus.OK,
      message: answers.success.user.updateWatching,
      data,
    };
  }
}
