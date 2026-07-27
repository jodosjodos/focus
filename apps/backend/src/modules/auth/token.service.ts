import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(user: User): string {
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
