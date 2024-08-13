import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Query,
  Put,
  // UseGuards,
  // Request,
} from '@nestjs/common';
import { AmenityService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Controller('amenities')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  async create(@Body() createAmenityDto: CreateAmenityDto) {
    return await this.amenityService.create(createAmenityDto);
  }

  @Get()
  async getPagination(
    @Query() paginationDto: PaginationDto,
    @Query() advancedSearchDto: AdvancedSearchDto,
  ) {
    return await this.amenityService.getPagination(
      paginationDto,
      advancedSearchDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.amenityService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAmenityDto: UpdateAmenityDto,
  ) {
    return await this.amenityService.update(id, updateAmenityDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.amenityService.remove(id);
  }
}
