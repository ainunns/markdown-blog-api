import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import {
  RegisterDto,
  RegisterUserResponseDto,
} from '../../application/dto/auth/register.dto';
import {
  LoginDto,
  LoginUserResponseDto,
} from '../../application/dto/auth/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { success, SuccessResponse } from '../response/response.util';
import { ApiProperty } from '@nestjs/swagger';

class RegisterUserSuccessResponse {
  @ApiProperty({ type: RegisterUserResponseDto })
  data!: RegisterUserResponseDto;

  @ApiProperty({ example: 'User registered successfully' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

class LoginUserSuccessResponse {
  @ApiProperty({ type: LoginUserResponseDto })
  data!: LoginUserResponseDto;

  @ApiProperty({ example: 'Login successful' })
  message!: string;

  @ApiProperty({ example: true })
  status!: true;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: RegisterUserSuccessResponse })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<SuccessResponse<RegisterUserResponseDto>> {
    const result = await this.registerUseCase.execute(dto);
    return success(result, 'User registered successfully');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginUserSuccessResponse })
  async login(
    @Body() dto: LoginDto,
  ): Promise<SuccessResponse<LoginUserResponseDto>> {
    const result = await this.loginUseCase.execute(dto);
    return success(result, 'Login successful');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Current authenticated user payload' })
  me(@CurrentUser() user: unknown) {
    return user;
  }
}
