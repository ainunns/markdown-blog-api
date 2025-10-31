import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  IsBoolean,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PostQueryDto {
  @ApiProperty({ example: 1, required: false, default: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    example: 10,
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  published?: boolean;

  @ApiProperty({ example: 'search term', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    example: 'createdAt',
    enum: ['created_at', 'updated_at', 'title'],
    required: false,
  })
  @IsEnum(['created_at', 'updated_at', 'title'])
  @IsOptional()
  sort?: 'created_at' | 'updated_at' | 'title';

  @ApiProperty({
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc';
}
