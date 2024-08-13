import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { HotelDetailsService } from './hotel_details.service';
import { CreateHotelDetailDto } from './dto/create-hotel_detail.dto';
import { UpdateHotelDetailDto } from './dto/update-hotel_detail.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearch } from './dto/advanced-search.dto';

@Controller('hotel-details')
export class HotelDetailsController {
  constructor(private readonly hotelDetailService: HotelDetailsService) {}

  @Post()
  async create(@Body() createHotelDetailDto: CreateHotelDetailDto) {
    return await this.hotelDetailService.create(createHotelDetailDto);
  }

  @Get()
  async getPagination(
    @Query() paginationDto: PaginationDto,
    @Query() advancedSearchDto: AdvancedSearch,
  ) {
    return await this.hotelDetailService.getPagination(
      paginationDto,
      advancedSearchDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.hotelDetailService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelDetailDto: UpdateHotelDetailDto,
  ) {
    return await this.hotelDetailService.update(id, updateHotelDetailDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.hotelDetailService.remove(id);
  }
}
