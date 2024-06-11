import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @description Create a new user
   * @param name
   * @param email
   * @param password
   * @returns User[]
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  /**
   * @description Find user by given id
   * @param id
   * @returns User
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, active: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * @description Find user by given email
   * @param email
   * @returns User[]
   */
  async findByEmail(email: string): Promise<User[]> {
    return await this.userRepository.find({ where: { email, active: true } });
  }

  async findByEmailOrUsername(email?: string, username?: string): Promise<User[]>{
    return await this.userRepository.find({ where: [{ email, active: true }, { username, active: true }] });
  }

  /**
   * @description Find all users
   * @returns User[]
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { active: true } });
  }

  /**
   * @description Deactive user by given id
   * @param id
   * @returns void
   */

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.active = false;
    await this.userRepository.save(user);
  }

  /**
   * @description Update user by given id
   * @param id
   * @param attrs: UpdateUserDto
   * @returns User
   */
  async update(id: number, attrs: Partial<User>): Promise<User>{
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attrs);
    return await this.userRepository.save(user);
  }
}
