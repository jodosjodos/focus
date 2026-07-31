import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  displayName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;

  @ValidateIf(
    (dto: UpdateProfileDto) =>
      dto.email !== undefined || dto.newPassword !== undefined,
  )
  @IsString()
  @MinLength(1)
  currentPassword?: string;
}
