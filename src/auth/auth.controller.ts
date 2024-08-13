import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  UnauthorizedException,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { TokenBlacklistService } from './TokenBlacklist/token-blacklist.service';
import { Public } from '../public.route';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
  ) {}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  // TODO: handle internal server error when unique constraint is violated.
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.name,
      registerDto.gmail,
      registerDto.password,
    );
  }

  @Post('login')
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: String })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const { name, password } = loginDto;
    return this.authService.login(name, password);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Public()
  async googleAuthRedirect(@Req() req, @Res() res) {
    return res.redirect(
      this.configService.get('UI_DOMAIN') +
        '/login?token=' +
        (await this.authService.googleLogin(req)).access_token,
    );
  }

  @Post('logout')
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Request() req: Request) {
    const token = AuthController.extractTokenFromHeader(req);

    if (token) {
      await this.tokenBlacklistService.addToBlacklist(token);
      console.log(this.tokenBlacklistService.getBlackListedTokens());
      return { message: 'Logged out successfully' };
    } else {
      throw new UnauthorizedException('No token provided');
    }
  }

  public static extractTokenFromHeader(request: Request): string | undefined {
    // @ts-expect-error TODO: come later to find out why typescript keep throwing error
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
