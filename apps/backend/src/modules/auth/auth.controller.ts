import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { accessToken, user } = await this.authService.register(dto);
    return { accessToken, user: UserResponseDto.fromEntity(user) };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: { user: User }) {
    const { accessToken, user } = this.authService.login(req.user);
    return { accessToken, user: UserResponseDto.fromEntity(user) };
  }
}
