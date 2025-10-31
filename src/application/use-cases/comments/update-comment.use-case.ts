import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ICommentRepository } from '../../../domain/comments/repository.comments';
import { CommentEntity } from '../../../domain/comments/entity.comments';
import { UpdateCommentDto } from '../../dto/comments/update-comment.dto';
import { CommentResponseDto } from '../../dto/comments/comment-response.dto';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(
    commentId: number,
    input: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const commentResult = await this.commentRepository.findById(commentId);
    if (!commentResult) {
      throw new NotFoundException('Comment not found');
    }

    const { comment } = commentResult;

    if (!comment.canEdit()) {
      throw new BadRequestException(
        `Comments can only be edited within ${CommentEntity.EDIT_WINDOW_MINUTES} minutes of creation`,
      );
    }

    const updatedComment = new CommentEntity(
      comment.id,
      comment.getPostId(),
      comment.getAuthorId(),
      input.body ?? comment.getBody(),
    );

    await this.commentRepository.update(updatedComment);

    const updatedResult = await this.commentRepository.findById(commentId);
    if (!updatedResult) {
      throw new Error('Failed to retrieve updated comment');
    }

    const { comment: updated, authorEmail: updatedAuthorEmail } = updatedResult;

    return {
      id: updated.id,
      postId: updated.getPostId(),
      authorId: updated.getAuthorId(),
      authorEmail: updatedAuthorEmail,
      body: updated.getBody(),
      canEdit: updated.canEdit(),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
