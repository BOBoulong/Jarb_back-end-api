import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { RoomOccupancyService } from './room_occupancy.service';
import { CreateRoomOccupancyDto } from './dto/create-room_occupancy.dto';
import { GetRoomOccupancyDto } from './dto/room-occupancy.dto';

@Controller('room-occupancy')
export class RoomOccupancyController {
  constructor(private readonly roomOccupancyService: RoomOccupancyService) {}

  @Post()
  async create(@Body() createRoomOccupancyDto: CreateRoomOccupancyDto) {
    return this.roomOccupancyService.create(createRoomOccupancyDto);
  }

  @Get()
  async getAll(@Query() filters: GetRoomOccupancyDto) {
    return this.roomOccupancyService.getAll(filters);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.roomOccupancyService.remove(id);
    return { message: 'Room occupancy record deleted successfully' };
  }
}
export { RoomOccupancyService };
