import { Slug } from '../shared/value-object/slug';
import { PostEntity } from './entity.posts';

export interface PostListFilters {
  authorId?: number;
  published?: boolean;
  search?: string;
}

export interface PostListOptions {
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
}

export interface PostWithEmail {
  post: PostEntity;
  authorEmail: string;
}

export interface PostListResult {
  posts: PostWithEmail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPostRepository {
  create(post: PostEntity): Promise<void>;
  findById(id: number): Promise<PostWithEmail | null>;
  findBySlug(slug: Slug): Promise<PostWithEmail | null>;
  findByAuthorId(authorId: number): Promise<PostEntity[]>;
  update(post: PostEntity): Promise<void>;
  delete(id: number): Promise<void>;
  list(
    filters?: PostListFilters,
    options?: PostListOptions,
  ): Promise<PostListResult>;
  findAuthorIdByPostId(postId: number): Promise<number | null>;
}
