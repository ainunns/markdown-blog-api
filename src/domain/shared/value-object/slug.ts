import { REGEX } from '../../../utils/regex';
import { BaseValueObject } from '../common/value-object';

/**
 * Slug must contain only lowercase letters, numbers and hyphens
 * Example: "hello-world-123" is valid, "hello--world" is invalid.
 */
export class Slug extends BaseValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  protected validate(): void {
    if (!this.props.value) {
      throw new Error('Slug is required');
    }

    if (this.props.value.length < 3) {
      throw new Error('Slug must be at least 3 characters long');
    }

    if (!REGEX.SLUG.test(this.props.value)) {
      throw new Error(
        'Slug must contain only lowercase letters, numbers and hyphens',
      );
    }
  }
}
