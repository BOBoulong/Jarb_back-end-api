import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from '../TokenBlacklist/token-blacklist.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../public.route';
import { AuthController } from '../auth.controller';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }
  //
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = AuthController.extractTokenFromHeader(request);

    // TODO: check on the reflector how it gets the context
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (this.tokenBlacklistService.isBlacklisted(token)) {
      return false;
    }

    return super.canActivate(context);
  }
}
