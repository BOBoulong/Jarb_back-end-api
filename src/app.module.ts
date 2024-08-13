import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenitiesModule } from './amenities/amenities.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomTypesModule } from './room_types/room_types.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomRatesModule } from './room_rates/room_rates.module';
import { HotelDetailsModule } from './hotel_details/hotel_details.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { TokenBlacklistModule } from './auth/TokenBlacklist/token-blacklist.module';
import { CustomersModule } from './customers/customers.module';
import { RoomOccupancyModule } from './room_occupancy/room_occupancy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.development', '.env.production'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AmenitiesModule,
    HotelsModule,
    HotelDetailsModule,
    RoomTypesModule,
    RoomsModule,
    RoomRatesModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuthModule,
    TokenBlacklistModule,
    CustomersModule,
    RoomOccupancyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
