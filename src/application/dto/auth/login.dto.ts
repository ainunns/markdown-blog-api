import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Same constraints as registration' })
  @IsString()
  password!: string;
}

export class LoginUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'user' })
  role!: string;

  @ApiProperty({ example: 'token' })
  accessToken!: string;
}
