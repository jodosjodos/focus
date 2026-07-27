import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: User }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.createEmailUser({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
    });

    return { accessToken: this.tokenService.signAccessToken(user), user };
  }

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(user: User): { accessToken: string; user: User } {
    return { accessToken: this.tokenService.signAccessToken(user), user };
  }
}
