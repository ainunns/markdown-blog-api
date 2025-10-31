import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX } from '../../../utils/regex';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 20,
    description: '8-20 chars, upper, lower, number, special !@#$%^&*',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(REGEX.PASSWORD, {
    message: 'Password must include upper, lower, number and special !@#$%^&*',
  })
  password!: string;
}

export class RegisterUserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'user' })
  role!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
