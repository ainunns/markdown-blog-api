import { Email } from '../shared/value-object/email';
import { UserEntity } from './entity.users';

export interface IUserRepository {
  create(user: UserEntity): Promise<void>;
  findById(id: number): Promise<UserEntity | null>;
  findByEmail(email: Email): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<void>;
  delete(id: number): Promise<void>;
}
