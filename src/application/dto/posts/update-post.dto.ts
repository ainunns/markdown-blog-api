import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({ example: 'Updated Title', required: false })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '# Updated Content', required: false })
  @IsString()
  @MinLength(1)
  @IsOptional()
  markdown?: string;

  @ApiProperty({ example: 'updated-slug', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
