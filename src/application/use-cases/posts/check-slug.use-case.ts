import { Inject, Injectable } from '@nestjs/common';
import type { IPostRepository } from '../../../domain/posts/repository.posts';
import { Slug } from '../../../domain/shared/value-object/slug';
import { CheckSlugResponseDto } from '../../dto/posts/check-slug.dto';

@Injectable()
export class CheckSlugUseCase {
  constructor(
    @Inject('IPostRepository')
    private readonly postRepository: IPostRepository,
  ) {}

  async execute(slug: string): Promise<CheckSlugResponseDto> {
    const slugVo = new Slug(slug);
    const existing = await this.postRepository.findBySlug(slugVo);

    return {
      available: existing === null,
    };
  }
}
