import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ICommentRepository } from '../../domain/comments/repository.comments';
import type { IPostRepository } from '../../domain/posts/repository.posts';

@Injectable()
export class CommentOwnershipGuard implements CanActivate {
  constructor(
    @Inject('ICommentRepository')
    private readonly commentRepository: ICommentRepository,
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { sub?: number; role?: string };
      params?: { id?: string };
    }>();

    const user = request.user;
    if (!user || !user.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    const commentId = request.params?.id;
    if (!commentId) {
      throw new NotFoundException('Comment ID not found in route');
    }

    const commentIdNum = parseInt(commentId, 10);
    if (isNaN(commentIdNum)) {
      throw new NotFoundException('Invalid comment ID');
    }

    const commentResult = await this.commentRepository.findById(commentIdNum);
    if (!commentResult) {
      throw new NotFoundException('Comment not found');
    }

    const { comment } = commentResult;
    const commentAuthorId = comment.getAuthorId();
    const postId = comment.getPostId();

    if (user.role === 'admin') {
      return true;
    }

    if (commentAuthorId === user.sub) {
      return true;
    }

    const postAuthorId = await this.postRepository.findAuthorIdByPostId(postId);
    if (postAuthorId !== null && postAuthorId === user.sub) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have permission to modify this comment',
    );
  }
}
