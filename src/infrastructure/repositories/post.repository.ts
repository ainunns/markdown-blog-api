import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type {
  IPostRepository,
  PostListFilters,
  PostListOptions,
  PostListResult,
  PostWithEmail,
} from '../../domain/posts/repository.posts';
import { PostEntity } from '../../domain/posts/entity.posts';
import { Slug } from '../../domain/shared/value-object/slug';
import { Markdown } from '../../domain/shared/value-object/markdown';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(post: PostEntity): Promise<void> {
    const data = this.mapEntityToCreate(post);
    await this.prisma.post.create({ data });
  }

  async findById(id: number): Promise<PostWithEmail | null> {
    const record = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });
    return record ? this.mapPrismaToEntityWithEmail(record) : null;
  }

  async findBySlug(slug: Slug): Promise<PostWithEmail | null> {
    const record = await this.prisma.post.findUnique({
      where: { slug: slug.getProps().value },
      include: { author: { select: { email: true } } },
    });
    return record ? this.mapPrismaToEntityWithEmail(record) : null;
  }

  async findByAuthorId(authorId: number): Promise<PostEntity[]> {
    const records = await this.prisma.post.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => this.mapPrismaToEntity(record));
  }

  async update(post: PostEntity): Promise<void> {
    const data = this.mapEntityToUpdate(post);
    await this.prisma.post.update({ where: { id: post.id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async list(
    filters?: PostListFilters,
    options?: PostListOptions,
  ): Promise<PostListResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (filters?.authorId !== undefined) {
      where.authorId = filters.authorId;
    }

    if (filters?.published !== undefined) {
      where.published = filters.published;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { markdown: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const sortField = options?.sort ?? 'createdAt';
    const sortOrder = options?.order ?? 'desc';
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortField]: sortOrder,
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { author: { select: { email: true } } },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      posts: posts.map((post) => this.mapPrismaToEntityWithEmail(post)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAuthorIdByPostId(postId: number): Promise<number | null> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });
    return post?.authorId ?? null;
  }

  private mapPrismaToEntity(record: {
    id: number;
    authorId: number;
    title: string;
    slug: string;
    markdown: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): PostEntity {
    return new PostEntity(
      record.id,
      record.authorId,
      record.title,
      new Slug(record.slug),
      new Markdown(record.markdown),
      record.published,
    );
  }

  private mapEntityToCreate(post: PostEntity) {
    return {
      authorId: post.getAuthorId(),
      title: post.getTitle(),
      slug: post.getSlug().getProps().value,
      markdown: post.getMarkdown().getProps().value,
      published: post.isPublished(),
    };
  }

  private mapEntityToUpdate(post: PostEntity) {
    return {
      title: post.getTitle(),
      slug: post.getSlug().getProps().value,
      markdown: post.getMarkdown().getProps().value,
      published: post.isPublished(),
    };
  }

  private mapPrismaToEntityWithEmail(record: {
    id: number;
    authorId: number;
    title: string;
    slug: string;
    markdown: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    author: { email: string };
  }): PostWithEmail {
    return {
      post: new PostEntity(
        record.id,
        record.authorId,
        record.title,
        new Slug(record.slug),
        new Markdown(record.markdown),
        record.published,
      ),
      authorEmail: record.author.email,
    };
  }
}
