import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { PostResponseDto } from '../../dto/posts/post-response.dto';

@Injectable()
export class TogglePublishUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: number): Promise<PostResponseDto> {
    const postResult = await this.postRepository.findById(postId);
    if (!postResult) {
      throw new NotFoundException('Post not found');
    }

    const { post } = postResult;

    if (post.isPublished()) {
      post.unpublish();
    } else {
      post.publish();
    }

    await this.postRepository.update(post);

    const updatedResult = await this.postRepository.findById(postId);
    if (!updatedResult) {
      throw new Error('Failed to retrieve updated post');
    }

    const { post: result, authorEmail } = updatedResult;

    return {
      id: result.id,
      authorId: result.getAuthorId(),
      authorEmail,
      title: result.getTitle(),
      slug: result.getSlug().getProps().value,
      markdown: result.getMarkdown().getProps().value,
      published: result.isPublished(),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      deletedAt: result.deletedAt,
    };
  }
}
