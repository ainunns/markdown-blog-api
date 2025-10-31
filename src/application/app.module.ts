import { Module } from '@nestjs/common';
import { ConfigModule } from '../infrastructure/config/config.module';
import { PrismaModule } from '../infrastructure/database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
})
export class AppModule {}
