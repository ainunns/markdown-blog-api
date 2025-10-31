import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    example: 'Updated comment text.',
    minLength: 1,
    maxLength: 10000,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Comment body cannot be empty' })
  @MaxLength(10000, { message: 'Comment body cannot exceed 10000 characters' })
  body?: string;
}
