import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  postId!: number;

  @ApiProperty({ example: 1 })
  authorId!: number;

  @ApiProperty({ example: 'user@example.com' })
  authorEmail!: string;

  @ApiProperty({ example: 'This is a great post! Thanks for sharing.' })
  body!: string;

  @ApiProperty({ example: true })
  canEdit!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
