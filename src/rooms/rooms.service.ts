import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomType } from 'src/room_types/entities/room_type.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { RoomOccupancy } from '../room_occupancy/entities/room_occupancy.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel) private hotelRepository: Repository<Hotel>,
    @InjectRepository(RoomOccupancy)
    private roomOccupancyRepository: Repository<RoomOccupancy>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const roomType = await this.roomTypeRepository.findOneOrFail({
      where: { id: createRoomDto.room_type_id },
    });
    const hotel = await this.hotelRepository.findOneOrFail({
      where: { id: createRoomDto.hotel_id },
    });
    const room = this.roomRepository.create({
      ...createRoomDto,
      roomType,
      hotel,
    });
    return this.roomRepository.save(room);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: Room[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { name, floor } = advancedSearchDto;

    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.hotel', 'hotel');

    if (name) {
      query.andWhere('room.name ILIKE :name', { name: `%${name}%` });
    }

    if (floor !== undefined) {
      query.andWhere('room.floor = :floor', { floor });
    }

    if (sortField && sortOrder) {
      query.orderBy(`room.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number, startDate?: Date, endDate?: Date): Promise<Room> {
    const queryBuilder = this.roomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.hotel', 'hotel')
      .leftJoinAndSelect('room.roomOccupancy', 'roomOccupancy')
      .leftJoinAndSelect('roomOccupancy.amenities', 'amenity')
      .leftJoinAndSelect('roomOccupancy.customers', 'customer')
      .where('room.id = :id', { id });

    if (startDate && endDate) {
      queryBuilder.andWhere(
        '(roomOccupancy.checked_in_time BETWEEN :startDate AND :endDate OR roomOccupancy.expected_checkout_time BETWEEN :startDate AND :endDate)',
        { startDate, endDate },
      );
    }

    const room = await queryBuilder.getOne();

    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(id: number): Promise<void> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) throw new NotFoundException(`Room with ID ${id} not found`);
    await this.roomRepository.remove(room);
  }
}
