import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PostOwnershipGuard } from '../guards/post-ownership.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  success,
  SuccessResponse,
  SuccessResponseWithPagination,
  successWithPagination,
} from '../response/response.util';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostDto } from '../../application/dto/posts/create-post.dto';
import { UpdatePostDto } from '../../application/dto/posts/update-post.dto';
import { PostQueryDto } from '../../application/dto/posts/post-query.dto';
import { CheckSlugResponseDto } from '../../application/dto/posts/check-slug.dto';
import { CreatePostUseCase } from '../../application/use-cases/posts/create-post.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/posts/update-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/posts/delete-post.use-case';
import { GetPostBySlugUseCase } from '../../application/use-cases/posts/get-post-by-slug.use-case';
import {
  ListPostsUseCase,
  ListPostsResponseDto,
} from '../../application/use-cases/posts/list-posts.use-case';
import { TogglePublishUseCase } from '../../application/use-cases/posts/toggle-publish.use-case';
import { CheckSlugUseCase } from '../../application/use-cases/posts/check-slug.use-case';
import { PostResponseDto } from '../../application/dto/posts/post-response.dto';

class CreatePostSuccessResponse {
  @ApiProperty({ type: PostResponseDto })
  data!: PostResponseDto;

  @ApiProperty({ example: 'Post created successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class GetPostSuccessResponse {
  @ApiProperty({ type: PostResponseDto })
  data!: PostResponseDto;

  @ApiProperty({ example: 'Post retrieved successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class ListPostsSuccessResponse {
  @ApiProperty({ type: ListPostsResponseDto })
  data!: ListPostsResponseDto;

  @ApiProperty({ example: 'Posts retrieved successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class CheckSlugSuccessResponse {
  @ApiProperty({ type: CheckSlugResponseDto })
  data!: CheckSlugResponseDto;

  @ApiProperty({ example: 'Slug check completed' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly listPostsUseCase: ListPostsUseCase,
    private readonly togglePublishUseCase: TogglePublishUseCase,
    private readonly checkSlugUseCase: CheckSlugUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ type: CreatePostSuccessResponse })
  async create(
    @Body() dto: CreatePostDto,
    @CurrentUser() user: { sub: number },
  ): Promise<SuccessResponse<PostResponseDto>> {
    const result = await this.createPostUseCase.execute(dto, user.sub);
    return success(result, 'Post created successfully');
  }

  @Get('slug/check/:slug')
  @ApiParam({ name: 'slug', example: 'my-first-blog-post' })
  @ApiOkResponse({ type: CheckSlugSuccessResponse })
  async checkSlug(
    @Param('slug') slug: string,
  ): Promise<SuccessResponse<CheckSlugResponseDto>> {
    const result = await this.checkSlugUseCase.execute(slug);
    return success(result, 'Slug check completed');
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'authorId', required: false, type: Number })
  @ApiQuery({ name: 'published', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['createdAt', 'updatedAt', 'title'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiOkResponse({ type: ListPostsSuccessResponse })
  async list(
    @Query() query: PostQueryDto,
  ): Promise<SuccessResponseWithPagination<PostResponseDto[]>> {
    const result = await this.listPostsUseCase.execute(query);
    return successWithPagination(
      result.posts,
      result.pagination,
      'Posts retrieved successfully',
    );
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', example: 'my-first-blog-post' })
  @ApiOkResponse({ type: GetPostSuccessResponse })
  async getBySlug(
    @Param('slug') slug: string,
  ): Promise<SuccessResponse<PostResponseDto>> {
    const result = await this.getPostBySlugUseCase.execute(slug);
    return success(result, 'Post retrieved successfully');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ type: GetPostSuccessResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ): Promise<SuccessResponse<PostResponseDto>> {
    const postId = parseInt(id, 10);
    const result = await this.updatePostUseCase.execute(postId, dto);
    return success(result, 'Post updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const postId = parseInt(id, 10);
    await this.deletePostUseCase.execute(postId);
  }

  @Patch(':id/toggle-publish')
  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: GetPostSuccessResponse })
  async togglePublish(
    @Param('id') id: string,
  ): Promise<SuccessResponse<PostResponseDto>> {
    const postId = parseInt(id, 10);
    const result = await this.togglePublishUseCase.execute(postId);
    return success(result, 'Post publish status toggled successfully');
  }
}
