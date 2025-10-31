import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  authorId!: number;

  @ApiProperty({ example: 'user@example.com' })
  authorEmail!: string;

  @ApiProperty({ example: 'My First Blog Post' })
  title!: string;

  @ApiProperty({ example: 'my-first-blog-post' })
  slug!: string;

  @ApiProperty({ example: '# Hello World\n\nThis is my first post.' })
  markdown!: string;

  @ApiProperty({ example: false })
  published!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
}
