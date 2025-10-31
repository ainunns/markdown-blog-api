import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ICommentRepository } from '../../../domain/comments/repository.comments';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(commentId: number): Promise<void> {
    const commentResult = await this.commentRepository.findById(commentId);
    if (!commentResult) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentRepository.delete(commentId);
  }
}
