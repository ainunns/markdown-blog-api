import { Inject, Injectable } from '@nestjs/common';
import type {
  ICommentRepository,
  CommentListFilters,
  CommentListOptions,
} from '../../../domain/comments/repository.comments';
import { CommentQueryDto } from '../../dto/comments/comment-query.dto';
import { CommentResponseDto } from '../../dto/comments/comment-response.dto';

export class ListCommentsResponseDto {
  comments!: CommentResponseDto[];
  pagination!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ListCommentsByPostUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(
    postId: number,
    query: CommentQueryDto,
  ): Promise<ListCommentsResponseDto> {
    const filters: CommentListFilters = {};
    if (query.authorId !== undefined) {
      filters.authorId = query.authorId;
    }

    const options: CommentListOptions = {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sort: query.sort as 'createdAt' | 'updatedAt' | undefined,
      order: query.order ?? 'desc',
    };

    const result = await this.commentRepository.listByPost(
      postId,
      filters,
      options,
    );

    const comments = result.comments.map(({ comment, authorEmail }) => ({
      id: comment.id,
      postId: comment.getPostId(),
      authorId: comment.getAuthorId(),
      authorEmail,
      body: comment.getBody(),
      canEdit: comment.canEdit(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      comments,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}
