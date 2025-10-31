import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';

@Injectable()
export class DeletePostUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(postId: number): Promise<void> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postRepository.delete(postId);
  }
}
