import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RoomTypeService } from './room_types.service';
import { CreateRoomTypeDto } from './dto/create-room_type.dto';
import { UpdateRoomTypeDto } from './dto/update-room_type.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Controller('room-types')
export class RoomTypeController {
  constructor(private readonly roomTypesService: RoomTypeService) {}

  @Post()
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return await this.roomTypesService.create(createRoomTypeDto);
  }

  @Get()
  async getPagination(
    @Query() paginationDto: PaginationDto,
    @Query() advancedSearchDto: AdvancedSearchDto,
  ) {
    return await this.roomTypesService.getPagination(
      paginationDto,
      advancedSearchDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roomTypesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomTypeDto: UpdateRoomTypeDto,
  ) {
    return await this.roomTypesService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.roomTypesService.remove(id);
  }
}
