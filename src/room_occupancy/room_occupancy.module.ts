import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomOccupancyService } from './room_occupancy.service';
import { RoomOccupancyController } from './room_occupancy.controller';
import { RoomOccupancy } from './entities/room_occupancy.entity';
import { Room } from '../rooms/entities/room.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Amenity } from '../amenities/entities/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomOccupancy, Room, Customer, Amenity])],
  providers: [RoomOccupancyService],
  controllers: [RoomOccupancyController],
  exports: [RoomOccupancyService],
})
export class RoomOccupancyModule {}
