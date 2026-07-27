import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  email: string;
  authProvider: string;
  displayName: string;
  createdAt: Date;
  currentProgramId: string | null;
  hardModeEnabled: boolean;

  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.authProvider = user.authProvider;
    dto.displayName = user.displayName;
    dto.createdAt = user.createdAt;
    dto.currentProgramId = user.currentProgramId;
    dto.hardModeEnabled = user.hardModeEnabled;
    return dto;
  }
}
