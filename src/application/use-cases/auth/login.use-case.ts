import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserRepository } from '../../../domain/users/repository.users';
import { Email } from '../../../domain/shared/value-object/email';
import { BcryptService } from '../../../infrastructure/auth/bcrypt.service';
import { LoginDto, LoginUserResponseDto } from '../../dto/auth/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository') private readonly users: IUserRepository,
    private readonly bcrypt: BcryptService,
    private readonly jwt: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<LoginUserResponseDto> {
    const email = new Email(input.email);
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.bcrypt.compare(
      input.password,
      user.getHashedPassword(),
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: input.email,
      role: user.getRole().getProps().value,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return {
      id: user.id,
      email: user.getEmail().getProps().value,
      role: user.getRole().getProps().value,
      accessToken,
    };
  }
}
