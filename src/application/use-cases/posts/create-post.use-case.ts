import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { PostEntity } from '../../../domain/posts/entity.posts';
import { Slug } from '../../../domain/shared/value-object/slug';
import { Markdown } from '../../../domain/shared/value-object/markdown';
import { CreatePostDto } from '../../dto/posts/create-post.dto';
import { PostResponseDto } from '../../dto/posts/post-response.dto';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    input: CreatePostDto,
    authorId: number,
  ): Promise<PostResponseDto> {
    const slug = new Slug(input.slug);

    const existing = await this.postRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException('Slug already exists');
    }

    const markdown = new Markdown(input.markdown);

    const post = new PostEntity(
      0,
      authorId,
      input.title,
      slug,
      markdown,
      input.published ?? false,
    );

    await this.postRepository.create(post);

    const createdResult = await this.postRepository.findBySlug(slug);
    if (!createdResult) {
      throw new Error('Failed to retrieve created post');
    }

    const { post: created, authorEmail } = createdResult;

    return {
      id: created.id,
      authorId: created.getAuthorId(),
      authorEmail,
      title: created.getTitle(),
      slug: created.getSlug().getProps().value,
      markdown: created.getMarkdown().getProps().value,
      published: created.isPublished(),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      deletedAt: created.deletedAt,
    };
  }
}
