import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My First Blog Post', minLength: 1, maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: '# Hello World\n\nThis is my first post.' })
  @IsString()
  @MinLength(1)
  markdown!: string;

  @ApiProperty({ example: 'my-first-blog-post', minLength: 3 })
  @IsString()
  @MinLength(3)
  slug!: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
