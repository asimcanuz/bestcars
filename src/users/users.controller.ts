import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    const user: User = await this.authService.signup(body);
    return plainToInstance(UserDto, user);
  }

  @Post('/signin')
  async signIn(@Body() body: SignInDto): Promise<UserDto> {
    const user: User = await this.authService.signin(body);
    return plainToInstance(UserDto, user);
  }

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users: User[] = await this.usersService.findAll();
    return plainToInstance(UserDto, users);
  }

  @Get('/email')
  async getUserByEmail(@Query('email') email: string): Promise<UserDto> {
    const user: User = await this.usersService.findByEmail(email);
    return plainToInstance(UserDto, user);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const user: User = await this.usersService.update(parseInt(id), body);
    return plainToInstance(UserDto, user);
  }

  @Patch(':id')
  async removeUser(@Param('id') id: string): Promise<void> {
    this.usersService.remove(parseInt(id));
  }

  @Get('/search')
  async findByEmailOrUsername(
    @Query('email') email: string,
    @Query('username') username: string,
  ): Promise<UserDto[]> {
    const users: User[] = await this.usersService.findByEmailOrUsername(
      email,
      username,
    );
    return plainToInstance(UserDto, users);
  }
}
