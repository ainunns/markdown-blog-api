import { ApiProperty } from '@nestjs/swagger';

export class CheckSlugResponseDto {
  @ApiProperty({
    example: true,
    description: 'True if slug is available, false if taken',
  })
  available!: boolean;
}
