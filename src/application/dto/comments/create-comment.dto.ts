import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post! Thanks for sharing.',
    minLength: 1,
    maxLength: 10000,
  })
  @IsString()
  @MinLength(1, { message: 'Comment body cannot be empty' })
  @MaxLength(10000, { message: 'Comment body cannot exceed 10000 characters' })
  body!: string;
}
