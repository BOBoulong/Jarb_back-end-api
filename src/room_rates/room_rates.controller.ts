import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomRateService } from './room_rates.service';
import { CreateRoomRateDto } from './dto/create-room_rate.dto';
import { UpdateRoomRateDto } from './dto/update-room_rate.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
@Controller('room-rates')
export class RoomRateController {
  constructor(private readonly roomRateService: RoomRateService) {}

  @Post()
  async create(@Body() createRoomRateDto: CreateRoomRateDto) {
    return await this.roomRateService.create(createRoomRateDto);
  }

  @Get()
  async getPagination(
    @Query() paginationDto: PaginationDto,
    @Query() advancedSearchDto: AdvancedSearchDto,
  ) {
    return await this.roomRateService.getPagination(
      paginationDto,
      advancedSearchDto,
    );
  }

  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roomRateService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomRateDto: UpdateRoomRateDto,
  ) {
    return await this.roomRateService.update(id, updateRoomRateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.roomRateService.remove(id);
  }
}
