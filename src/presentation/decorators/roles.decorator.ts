import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../guards/roles.guard';

export const Roles = (...roles: Array<'user' | 'admin'>) =>
  SetMetadata(ROLES_KEY, roles);
