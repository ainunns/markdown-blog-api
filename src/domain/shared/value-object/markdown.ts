import { BaseValueObject } from '../common/value-object';

/**
 * Markdown content value object
 * Must be non-empty and have reasonable length
 */
export class Markdown extends BaseValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  protected validate(): void {
    if (!this.props.value) {
      throw new Error('Markdown is required');
    }

    if (this.props.value.trim().length === 0) {
      throw new Error('Markdown cannot be empty');
    }

    // Reasonable max length for blog posts (e.g., 1MB of text)
    const MAX_LENGTH = 1_000_000;
    if (this.props.value.length > MAX_LENGTH) {
      throw new Error(`Markdown cannot exceed ${MAX_LENGTH} characters`);
    }
  }

  public getValue(): string {
    return this.props.value;
  }
}
