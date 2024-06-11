import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";
import { CreateUserDto } from "./dto/create-user.dto";
import { SignInDto } from './dto/sign-in.dto';
import { User } from "./user.entity";
import { UsersService } from './users.service';

const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }
  
  async signup(createUserDto:CreateUserDto) : Promise<User> {
    const { email, password } = createUserDto
    
    const existEmailUser: User =await this.usersService.findByEmail(email);
    
    if (existEmailUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    createUserDto.password = hashedPassword;
    
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  async signin(signInDto:SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  
    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}