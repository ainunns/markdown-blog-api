import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IUserRepository } from '../../domain/users/repository.users';
import { UserEntity } from '../../domain/users/entity.users';
import { Email } from '../../domain/shared/value-object/email';
import { Role } from '../../domain/shared/value-object/role';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<void> {
    const data = this.mapEntityToCreate(user);
    await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ? data.role : undefined,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.mapPrismaToEntity(record) : null;
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.getProps().value },
    });
    return record ? this.mapPrismaToEntity(record) : null;
  }

  async update(user: UserEntity): Promise<void> {
    const data = this.mapEntityToUpdate(user);
    await this.prisma.user.update({ where: { id: user.id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private mapPrismaToEntity(record: {
    id: number;
    email: string;
    passwordHash: string;
    role: string;
  }): UserEntity {
    return new UserEntity(
      record.id,
      new Email(record.email),
      record.passwordHash,
      new Role(record.role === 'admin' ? 'admin' : 'user'),
    );
  }

  private mapEntityToCreate(user: UserEntity) {
    return {
      email: user.getEmail().getProps().value,
      passwordHash: user.getHashedPassword(),
      role: user.getRole().getProps().value,
    };
  }

  private mapEntityToUpdate(user: UserEntity) {
    return {
      email: user.getEmail().getProps().value,
      passwordHash: user.getHashedPassword(),
      role: user.getRole().getProps().value,
    };
  }
}
