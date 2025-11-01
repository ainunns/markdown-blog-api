import { PrismaClient } from '@prisma/client';
import { BcryptService } from '../../../auth/bcrypt.service';

export class UserSeeder {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly bcrypt: BcryptService,
  ) {}

  async userData(): Promise<
    { email: string; passwordHash: string; role: string }[]
  > {
    return [
      {
        email: 'admin@example.com',
        passwordHash: await this.bcrypt.hash('password'),
        role: 'admin',
      },
      {
        email: 'user@example.com',
        passwordHash: await this.bcrypt.hash('password'),
        role: 'user',
      },
    ];
  }

  async seedUsers() {
    const users = await this.userData();

    await Promise.all(
      users.map(async (user) => {
        await this.prisma.user.create({
          data: {
            email: user.email,
            passwordHash: user.passwordHash,
            role: user.role === 'admin' ? 'admin' : 'user',
          },
        });
      }),
    );
  }
}
