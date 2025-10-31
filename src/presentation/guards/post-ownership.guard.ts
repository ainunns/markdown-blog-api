import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IPostRepository } from '../../domain/posts/repository.posts';

export const POST_OWNERSHIP_KEY = 'postOwnership';

@Injectable()
export class PostOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { sub?: number };
      params?: { id?: string };
    }>();

    const user = request.user;
    if (!user || !user.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    const postId = request.params?.id;
    if (!postId) {
      throw new NotFoundException('Post ID not found in route');
    }

    const postIdNum = parseInt(postId, 10);
    if (isNaN(postIdNum)) {
      throw new NotFoundException('Invalid post ID');
    }

    const authorId = await this.postRepository.findAuthorIdByPostId(postIdNum);
    if (authorId === null) {
      throw new NotFoundException('Post not found');
    }

    if (authorId !== user.sub) {
      throw new ForbiddenException('You do not own this post');
    }

    return true;
  }
}
