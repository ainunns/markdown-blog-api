import { CommentEntity } from './entity.comments';

export interface CommentListFilters {
  authorId?: number;
}

export interface CommentListOptions {
  page?: number;
  limit?: number;
  sort?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface CommentWithAuthor {
  comment: CommentEntity;
  authorEmail: string;
}

export interface CommentListResult {
  comments: CommentWithAuthor[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICommentRepository {
  create(comment: CommentEntity): Promise<number>;
  findById(id: number): Promise<CommentWithAuthor | null>;
  update(comment: CommentEntity): Promise<void>;
  delete(id: number): Promise<void>;
  listByPost(
    postId: number,
    filters?: CommentListFilters,
    options?: CommentListOptions,
  ): Promise<CommentListResult>;
  findAuthorIdByCommentId(commentId: number): Promise<number | null>;
  findPostIdByCommentId(commentId: number): Promise<number | null>;
}
