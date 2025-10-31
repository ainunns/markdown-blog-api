import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/users/repository.users';
import { Email } from '../../../domain/shared/value-object/email';
import { Role } from '../../../domain/shared/value-object/role';
import { UserEntity } from '../../../domain/users/entity.users';
import { BcryptService } from '../../../infrastructure/auth/bcrypt.service';
import {
  RegisterDto,
  RegisterUserResponseDto,
} from '../../dto/auth/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    private readonly bcrypt: BcryptService,
  ) {}

  async execute(input: RegisterDto): Promise<RegisterUserResponseDto> {
    const email = new Email(input.email);

    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.bcrypt.hash(input.password);
    const role = new Role('user');

    // id is assigned by DB; use 0 as placeholder for domain construction
    const user = new UserEntity(0, email, hashedPassword, role);
    await this.users.create(user);

    // Fetch created user to include DB-assigned id if needed later
    const created = await this.users.findByEmail(email);

    return {
      id: created!.id,
      email: created!.getEmail().getProps().value,
      role: created!.getRole().getProps().value,
      createdAt: created!.createdAt,
      updatedAt: created!.updatedAt,
      deletedAt: created!.deletedAt,
    };
  }
}
