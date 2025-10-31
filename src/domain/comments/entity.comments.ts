import { BaseEntity } from '../shared/common/entity';

export class CommentEntity extends BaseEntity {
  private readonly postId: number;
  private readonly authorId: number;
  private readonly body: string;

  // Edit window in minutes
  public static readonly EDIT_WINDOW_MINUTES = 15;

  constructor(id: number, postId: number, authorId: number, body: string) {
    if (!body || body.trim().length === 0) {
      throw new Error('Comment body cannot be empty');
    }

    if (body.length > 10000) {
      throw new Error('Comment body cannot exceed 10000 characters');
    }

    if (postId <= 0) {
      throw new Error('Invalid post ID');
    }

    if (authorId <= 0) {
      throw new Error('Invalid author ID');
    }

    super(id);
    this.postId = postId;
    this.authorId = authorId;
    this.body = body;
  }

  protected validate(): void {}

  public getPostId(): number {
    return this.postId;
  }

  public getAuthorId(): number {
    return this.authorId;
  }

  public getBody(): string {
    return this.body;
  }

  /**
   * Check if the comment can still be edited
   * Comments can only be edited within the EDIT_WINDOW_MINUTES after creation
   */
  public canEdit(): boolean {
    const now = new Date();
    const timeDiff = now.getTime() - this.createdAt.getTime();
    const minutesPassed = timeDiff / (1000 * 60);
    return minutesPassed <= CommentEntity.EDIT_WINDOW_MINUTES;
  }
}
