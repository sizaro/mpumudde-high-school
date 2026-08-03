import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../../common/decorators/permissions.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: { permissions?: string[] } }>();
    const permissions = user?.permissions ?? [];
    return (
      permissions.includes('actions.all') ||
      requiredPermissions.some((permission) => permissions.includes(permission))
    );
  }
}
