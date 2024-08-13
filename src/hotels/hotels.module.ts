import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Role])],
  providers: [HotelsService],
  controllers: [HotelsController],
  exports: [TypeOrmModule.forFeature([Hotel])],
})
export class HotelsModule {}
