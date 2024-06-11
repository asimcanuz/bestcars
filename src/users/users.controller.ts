import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Session,
  UseGuards
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
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
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<UserDto> {
    const user: User = await this.authService.signup(body);
    session.userId = user.id;
    return plainToInstance(UserDto, user);
  }

  @Post('/signin')
  async signIn(
    @Body() body: SignInDto,
    @Session() session: any,
  ): Promise<UserDto> {
    const user: User = await this.authService.signin(body);
    session.userId = user.id;
    return plainToInstance(UserDto, user);
  }

  @Get('/signout')
  signOut(@Session() session: any) {
    if (!session.userId) {
      throw new Error('You are not signed in');
    }
    session.userId = null;
    return 'Sign out successfully';
  }

  // @Get('/me')
  // async getMe(@Session() session: any): Promise<UserDto> {
  //   const user: User = await this.usersService.findOne(parseInt(session.userId));
  //   return plainToInstance(UserDto, user);
  // }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User): Promise<UserDto> {
    console.log(user);
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
