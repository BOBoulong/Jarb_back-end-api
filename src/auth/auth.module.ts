import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategys/google.strategy';
import { JwtStrategy } from './strategys/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TokenBlacklistService } from './TokenBlacklist/token-blacklist.service';
import { TokenBlacklistModule } from './TokenBlacklist/token-blacklist.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TokenBlacklistModule,
  ],
  providers: [AuthService, TokenBlacklistService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
