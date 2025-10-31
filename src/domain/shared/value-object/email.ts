import { REGEX } from '../../../utils/regex';
import { BaseValueObject } from '../common/value-object';

/**
 * Email must be a valid email address
 */
export class Email extends BaseValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  protected validate(): void {
    if (!this.props.value) {
      throw new Error('Email is required');
    }

    if (!REGEX.EMAIL.test(this.props.value)) {
      throw new Error('Invalid email address format');
    }
  }
}
