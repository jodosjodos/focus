import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthProvider, User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

const SALT_ROUNDS = 10;

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

  async updateHardMode(id: string, hardModeEnabled: boolean): Promise<User> {
    const user = await this.findByIdOrThrow(id);
    user.hardModeEnabled = hardModeEnabled;
    return this.usersRepository.save(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findByIdOrThrow(id);

    if (dto.email !== undefined || dto.newPassword !== undefined) {
      if (!user.passwordHash) {
        throw new BadRequestException(
          'This account has no password set and cannot verify identity this way',
        );
      }
      const matches = await bcrypt.compare(
        dto.currentPassword!,
        user.passwordHash,
      );
      if (!matches) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    if (dto.email !== undefined && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.email = dto.email;
    }

    if (dto.newPassword !== undefined) {
      user.passwordHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    }

    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName;
    }

    return this.usersRepository.save(user);
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
