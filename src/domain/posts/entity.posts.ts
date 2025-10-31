import { BaseEntity } from '../shared/common/entity';
import { Slug } from '../shared/value-object/slug';
import { Markdown } from '../shared/value-object/markdown';

export class PostEntity extends BaseEntity {
  private readonly authorId: number;
  private readonly title: string;
  private readonly slug: Slug;
  private readonly markdown: Markdown;
  private published: boolean;

  constructor(
    id: number,
    authorId: number,
    title: string,
    slug: Slug,
    markdown: Markdown,
    published: boolean,
  ) {
    super(id);
    this.authorId = authorId;
    this.title = title;
    this.slug = slug;
    this.markdown = markdown;
    this.published = published;
  }

  protected validate(): void {}

  public getAuthorId(): number {
    return this.authorId;
  }

  public getTitle(): string {
    return this.title;
  }

  public getSlug(): Slug {
    return this.slug;
  }

  public getMarkdown(): Markdown {
    return this.markdown;
  }

  public isPublished(): boolean {
    return this.published;
  }

  public publish(): void {
    if (!this.published) {
      this.published = true;
      this.touch();
    }
  }

  public unpublish(): void {
    if (this.published) {
      this.published = false;
      this.touch();
    }
  }
}
