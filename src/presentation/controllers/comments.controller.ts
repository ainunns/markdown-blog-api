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
import { CommentOwnershipGuard } from '../guards/comment-ownership.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  success,
  SuccessResponse,
  SuccessResponseWithPagination,
  successWithPagination,
} from '../response/response.util';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCommentDto } from '../../application/dto/comments/create-comment.dto';
import { UpdateCommentDto } from '../../application/dto/comments/update-comment.dto';
import { CommentQueryDto } from '../../application/dto/comments/comment-query.dto';
import { CommentResponseDto } from '../../application/dto/comments/comment-response.dto';
import { CreateCommentUseCase } from '../../application/use-cases/comments/create-comment.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/comments/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/comments/delete-comment.use-case';
import { ListCommentsByPostUseCase } from '../../application/use-cases/comments/list-comments-by-post.use-case';

class CreateCommentSuccessResponse {
  @ApiProperty({ type: CommentResponseDto })
  data!: CommentResponseDto;

  @ApiProperty({ example: 'Comment created successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class GetCommentSuccessResponse {
  @ApiProperty({ type: CommentResponseDto })
  data!: CommentResponseDto;

  @ApiProperty({ example: 'Comment retrieved successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class ListCommentsSuccessResponse {
  @ApiProperty()
  data!: {
    comments: CommentResponseDto[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };

  @ApiProperty({ example: 'Comments retrieved successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly listCommentsByPostUseCase: ListCommentsByPostUseCase,
  ) {}

  @Post('posts/:postId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'postId', type: Number })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ type: CreateCommentSuccessResponse })
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: { sub: number },
  ): Promise<SuccessResponse<CommentResponseDto>> {
    const postIdNum = parseInt(postId, 10);
    const result = await this.createCommentUseCase.execute(
      postIdNum,
      dto,
      user.sub,
    );
    return success(result, 'Comment created successfully');
  }

  @Get('posts/:postId/comments')
  @ApiParam({ name: 'postId', type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'authorId', required: false, type: Number })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['created_at', 'updated_at'],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiOkResponse({ type: ListCommentsSuccessResponse })
  async list(
    @Param('postId') postId: string,
    @Query() query: CommentQueryDto,
  ): Promise<SuccessResponseWithPagination<CommentResponseDto[]>> {
    const postIdNum = parseInt(postId, 10);
    const result = await this.listCommentsByPostUseCase.execute(
      postIdNum,
      query,
    );
    return successWithPagination(
      result.comments,
      result.pagination,
      'Comments retrieved successfully',
    );
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard, CommentOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({ type: GetCommentSuccessResponse })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
  ): Promise<SuccessResponse<CommentResponseDto>> {
    const commentId = parseInt(id, 10);
    const result = await this.updateCommentUseCase.execute(commentId, dto);
    return success(result, 'Comment updated successfully');
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard, CommentOwnershipGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const commentId = parseInt(id, 10);
    await this.deleteCommentUseCase.execute(commentId);
  }
}
