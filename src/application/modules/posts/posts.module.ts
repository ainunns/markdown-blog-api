import { Module } from '@nestjs/common';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';
import { PostOwnershipGuard } from '../../../presentation/guards/post-ownership.guard';
import { PostsController } from '../../../presentation/controllers/posts.controller';
import { CreatePostUseCase } from '../../use-cases/posts/create-post.use-case';
import { UpdatePostUseCase } from '../../use-cases/posts/update-post.use-case';
import { DeletePostUseCase } from '../../use-cases/posts/delete-post.use-case';
import { GetPostBySlugUseCase } from '../../use-cases/posts/get-post-by-slug.use-case';
import { ListPostsUseCase } from '../../use-cases/posts/list-posts.use-case';
import { TogglePublishUseCase } from '../../use-cases/posts/toggle-publish.use-case';
import { CheckSlugUseCase } from '../../use-cases/posts/check-slug.use-case';

@Module({
  controllers: [PostsController],
  providers: [
    PostRepository,
    PostOwnershipGuard,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostBySlugUseCase,
    ListPostsUseCase,
    TogglePublishUseCase,
    CheckSlugUseCase,
    { provide: 'IPostRepository', useClass: PostRepository },
  ],
  exports: [
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostBySlugUseCase,
    ListPostsUseCase,
    TogglePublishUseCase,
    CheckSlugUseCase,
    'IPostRepository',
  ],
})
export class PostsModule {}
