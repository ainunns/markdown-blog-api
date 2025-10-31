import { BaseEntity } from '../shared/common/entity';
import { Email } from '../shared/value-object/email';
import { Role } from '../shared/value-object/role';

export class UserEntity extends BaseEntity {
  private readonly email: Email;
  private readonly role: Role;
  private readonly hashedPassword: string;

  constructor(id: number, email: Email, password: string, role: Role) {
    super(id);
    this.email = email;
    this.role = role;
    this.hashedPassword = password;
  }

  protected validate(): void {}

  public getEmail(): Email {
    return this.email;
  }

  public getRole(): Role {
    return this.role;
  }

  public getHashedPassword(): string {
    return this.hashedPassword;
  }
}
