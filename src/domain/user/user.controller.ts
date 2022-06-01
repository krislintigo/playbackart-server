import { Controller, Get, Param } from '@nestjs/common';
import UserService from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Get('/:id/short')
  async findOneShort(@Param('id') id: string) {
    return await this.userService.findOneShort(id);
  }
}
