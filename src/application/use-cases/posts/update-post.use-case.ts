import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { Slug } from '../../../domain/shared/value-object/slug';
import { Markdown } from '../../../domain/shared/value-object/markdown';
import { UpdatePostDto } from '../../dto/posts/update-post.dto';
import { PostResponseDto } from '../../dto/posts/post-response.dto';
import { PostEntity } from '../../../domain/posts/entity.posts';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    postId: number,
    input: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const existingResult = await this.postRepository.findById(postId);
    if (!existingResult) {
      throw new NotFoundException('Post not found');
    }

    const { post: existing } = existingResult;

    const title = input.title ?? existing.getTitle();
    const slug = input.slug ? new Slug(input.slug) : existing.getSlug();
    const markdown = input.markdown
      ? new Markdown(input.markdown)
      : existing.getMarkdown();
    const published = input.published ?? existing.isPublished();

    if (input.slug && input.slug !== existing.getSlug().getProps().value) {
      const slugExists = await this.postRepository.findBySlug(slug);
      if (slugExists && slugExists.post.id !== postId) {
        throw new ConflictException('Slug already exists');
      }
    }

    const updated = new PostEntity(
      existing.id,
      existing.getAuthorId(),
      title,
      slug,
      markdown,
      published,
    );

    await this.postRepository.update(updated);

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
