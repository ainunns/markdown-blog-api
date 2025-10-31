import { Module } from '@nestjs/common';
import { ConfigModule } from '../infrastructure/config/config.module';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}
