import { Inject, Injectable } from '@nestjs/common';
import type {
  IPostRepository,
  PostListFilters,
  PostListOptions,
} from '../../../domain/posts/repository.posts';
import { PostQueryDto } from '../../dto/posts/post-query.dto';
import { PostResponseDto } from '../../dto/posts/post-response.dto';

export class ListPostsResponseDto {
  posts!: PostResponseDto[];
  pagination!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ListPostsUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(query: PostQueryDto): Promise<ListPostsResponseDto> {
    const filters: PostListFilters = {};
    if (query.authorId !== undefined) {
      filters.authorId = query.authorId;
    }
    if (query.published !== undefined) {
      filters.published = query.published;
    }
    if (query.search) {
      filters.search = query.search;
    }

    const options: PostListOptions = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    };

    const result = await this.postRepository.list(filters, options);

    return {
      posts: result.posts.map(({ post, authorEmail }) => ({
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
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}
