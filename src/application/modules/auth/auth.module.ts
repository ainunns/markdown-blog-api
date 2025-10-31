import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule } from '../../../infrastructure/config/config.module';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from '../../../infrastructure/auth/bcrypt.service';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { AuthController } from '../../../presentation/controllers/auth.controller';
import { RegisterUseCase } from '../../use-cases/auth/register.use-case';
import { LoginUseCase } from '../../use-cases/auth/login.use-case';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const rawExpires = config.get<string>('JWT_ACCESS_EXPIRES');
        const expiresIn = (rawExpires ??
          '15m') as unknown as JwtSignOptions['expiresIn'];
        return {
          secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    BcryptService,
    JwtStrategy,
    UserRepository,
    RegisterUseCase,
    LoginUseCase,
    { provide: 'IUserRepository', useClass: UserRepository },
  ],
  exports: [BcryptService, JwtStrategy],
})
export class AuthModule {}
