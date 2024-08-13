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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async getPagination(
    @Query() paginationDto: PaginationDto,
    @Query() advanceSearch: AdvancedSearchDto,
  ) {
    return await this.usersService.getPagination(paginationDto, advanceSearch);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.remove(id);
  }

  @Post(':id/assign-role/:roleId')
  assignRole(@Param('id') id: string, @Param('roleId') roleId: string) {
    return this.usersService.assignRole(+id, +roleId);
  }

  @Post(':id/assign-hotel/:hotelId')
  assignHotel(@Param('id') id: string, @Param('hotelId') hotelId: string) {
    return this.usersService.assignHotel(+id, +hotelId);
  }
}
