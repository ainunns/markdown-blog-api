import { PrismaClient } from '@prisma/client';
import { BcryptService } from '../../auth/bcrypt.service';
import { UserSeeder } from './seeder/user.seeder';
import { ConfigService } from '@nestjs/config';

export class Seed {
  userSeeder: UserSeeder;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly bcrypt: BcryptService,
  ) {}

  async seed() {
    this.userSeeder = new UserSeeder(this.prisma, this.bcrypt);

    try {
      console.log('Seeding users...');

      await this.userSeeder.seedUsers();

      console.log('Users seeded successfully');
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
      console.log('Disconnected from database');
      process.exit(0);
    }
  }
}

const prisma = new PrismaClient();
const bcrypt = new BcryptService(new ConfigService());
const seed = new Seed(prisma, bcrypt);

void (async () => {
  await seed.seed();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
