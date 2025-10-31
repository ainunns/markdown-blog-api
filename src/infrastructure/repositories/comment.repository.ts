import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import type {
  ICommentRepository,
  CommentListFilters,
  CommentListOptions,
  CommentListResult,
  CommentWithAuthor,
} from '../../domain/comments/repository.comments';
import { CommentEntity } from '../../domain/comments/entity.comments';

@Injectable()
export class CommentRepository implements ICommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(comment: CommentEntity): Promise<number> {
    const data = this.mapEntityToCreate(comment);
    const created = await this.prisma.comment.create({ data });
    return created.id;
  }

  async findById(id: number): Promise<CommentWithAuthor | null> {
    const record = await this.prisma.comment.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });
    return record ? this.mapPrismaToEntityWithAuthor(record) : null;
  }

  async update(comment: CommentEntity): Promise<void> {
    const data = this.mapEntityToUpdate(comment);
    await this.prisma.comment.update({ where: { id: comment.id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.comment.delete({ where: { id } });
  }

  async listByPost(
    postId: number,
    filters?: CommentListFilters,
    options?: CommentListOptions,
  ): Promise<CommentListResult> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = { postId };

    if (filters?.authorId !== undefined) {
      where.authorId = filters.authorId;
    }

    const sortField = options?.sort ?? 'createdAt';
    const sortOrder = options?.order ?? 'desc';
    const orderBy: Prisma.CommentOrderByWithRelationInput = {
      [sortField]: sortOrder,
    };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { author: { select: { email: true } } },
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      comments: comments.map((comment) =>
        this.mapPrismaToEntityWithAuthor(comment),
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAuthorIdByCommentId(commentId: number): Promise<number | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });
    return comment?.authorId ?? null;
  }

  async findPostIdByCommentId(commentId: number): Promise<number | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });
    return comment?.postId ?? null;
  }

  private mapPrismaToEntity(record: {
    id: number;
    postId: number;
    authorId: number;
    body: string;
    createdAt: Date;
    updatedAt: Date;
  }): CommentEntity {
    const entity = new CommentEntity(
      record.id,
      record.postId,
      record.authorId,
      record.body,
    );
    return entity;
  }

  private mapEntityToCreate(comment: CommentEntity) {
    return {
      postId: comment.getPostId(),
      authorId: comment.getAuthorId(),
      body: comment.getBody(),
    };
  }

  private mapEntityToUpdate(comment: CommentEntity) {
    return {
      body: comment.getBody(),
    };
  }

  private mapPrismaToEntityWithAuthor(record: {
    id: number;
    postId: number;
    authorId: number;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    author: { email: string };
  }): CommentWithAuthor {
    const entity = this.mapPrismaToEntity({
      id: record.id,
      postId: record.postId,
      authorId: record.authorId,
      body: record.body,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
    return {
      comment: entity,
      authorEmail: record.author.email,
    };
  }
}
