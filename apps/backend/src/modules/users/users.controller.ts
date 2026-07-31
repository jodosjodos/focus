import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findByIdOrThrow(id);
    return UserResponseDto.fromEntity(user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Request() req: { user: User },
  ) {
    if (req.user.id !== id) {
      throw new ForbiddenException("Cannot update another user's account");
    }
    const user =
      dto.hardModeEnabled === undefined
        ? await this.usersService.findByIdOrThrow(id)
        : await this.usersService.updateHardMode(id, dto.hardModeEnabled);
    return UserResponseDto.fromEntity(user);
  }
}
