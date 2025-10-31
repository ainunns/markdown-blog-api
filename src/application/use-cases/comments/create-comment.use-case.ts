import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ICommentRepository } from '../../../domain/comments/repository.comments';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { CommentEntity } from '../../../domain/comments/entity.comments';
import { CreateCommentDto } from '../../dto/comments/create-comment.dto';
import { CommentResponseDto } from '../../dto/comments/comment-response.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(
    postId: number,
    input: CreateCommentDto,
    authorId: number,
  ): Promise<CommentResponseDto> {
    const postResult = await this.postRepository.findById(postId);
    if (!postResult) {
      throw new NotFoundException('Post not found');
    }

    const { post } = postResult;
    if (!post.isPublished()) {
      throw new BadRequestException('Cannot comment on unpublished posts');
    }

    const comment = new CommentEntity(0, postId, authorId, input.body);

    const createdId = await this.commentRepository.create(comment);

    const createdResult = await this.commentRepository.findById(createdId);
    if (!createdResult) {
      throw new Error('Failed to retrieve created comment');
    }

    const { comment: created, authorEmail } = createdResult;

    return {
      id: created.id,
      postId: created.getPostId(),
      authorId: created.getAuthorId(),
      authorEmail,
      body: created.getBody(),
      canEdit: created.canEdit(),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}
