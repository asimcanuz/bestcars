import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<void> {
    this.usersService.create(body);
  }

  @Get('/users')
  async getUsers(): Promise<UserDto[]> {
    const users: User[] = await this.usersService.findAll();
    return plainToInstance(UserDto, users);
  }

  @Get('/user/:id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    const user: User = await this.usersService.findOne(parseInt(id));
    return plainToInstance(UserDto,user)
  }


  @Get('/user')
  async getUserByEmail(@Query('email') email: string): Promise<UserDto[]> {
    const users: User[] = await this.usersService.findByEmail(email);
    return plainToInstance(UserDto, users);
  }

  @Put('/user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const user: User = await this.usersService.update(parseInt(id), body);
    return plainToInstance(UserDto, user);
  }

  @Patch('/user/:id')
  async removeUser(@Param('id') id: string): Promise<void> {
    this.usersService.remove(parseInt(id));
  }
}
