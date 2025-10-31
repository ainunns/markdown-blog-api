import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { Slug } from '../../../domain/shared/value-object/slug';
import { PostResponseDto } from '../../dto/posts/post-response.dto';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(slug: string): Promise<PostResponseDto> {
    const slugVo = new Slug(slug);
    const result = await this.postRepository.findBySlug(slugVo);

    if (!result) {
      throw new NotFoundException('Post not found');
    }

    const { post, authorEmail } = result;

    return {
      id: post.id,
      authorId: post.getAuthorId(),
      authorEmail,
      title: post.getTitle(),
      slug: post.getSlug().getProps().value,
      markdown: post.getMarkdown().getProps().value,
      published: post.isPublished(),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      deletedAt: post.deletedAt,
    };
  }
}
