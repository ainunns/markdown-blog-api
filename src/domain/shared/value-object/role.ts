import { BaseValueObject } from '../common/value-object';

/**
 * Role must be one of: admin, user
 */
const ROLES = ['admin', 'user'] as const;

export class Role extends BaseValueObject<{ value: (typeof ROLES)[number] }> {
  constructor(value: (typeof ROLES)[number]) {
    super({ value });
  }

  protected validate(): void {
    if (!this.props.value) {
      throw new Error('Role is required');
    }

    if (!ROLES.includes(this.props.value)) {
      throw new Error('Invalid role, must be one of: ' + ROLES.join(', '));
    }
  }
}
