import { Module } from '@nestjs/common';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { CommentOwnershipGuard } from '../../../presentation/guards/comment-ownership.guard';
import { CommentsController } from '../../../presentation/controllers/comments.controller';
import { CreateCommentUseCase } from '../../use-cases/comments/create-comment.use-case';
import { UpdateCommentUseCase } from '../../use-cases/comments/update-comment.use-case';
import { DeleteCommentUseCase } from '../../use-cases/comments/delete-comment.use-case';
import { ListCommentsByPostUseCase } from '../../use-cases/comments/list-comments-by-post.use-case';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [CommentsController],
  providers: [
    CommentRepository,
    CommentOwnershipGuard,
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    ListCommentsByPostUseCase,
    { provide: 'ICommentRepository', useClass: CommentRepository },
  ],
  exports: [
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    ListCommentsByPostUseCase,
  ],
})
export class CommentsModule {}
