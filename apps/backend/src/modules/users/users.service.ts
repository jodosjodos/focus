import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvider, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  createEmailUser(params: {
    email: string;
    passwordHash: string;
    displayName: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      email: params.email,
      passwordHash: params.passwordHash,
      displayName: params.displayName,
      authProvider: AuthProvider.EMAIL,
      hardModeEnabled: false,
      currentProgramId: null,
    });
    return this.usersRepository.save(user);
  }
}
