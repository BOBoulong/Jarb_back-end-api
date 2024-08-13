import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoomType } from './entities/room_type.entity';
import { CreateRoomTypeDto } from './dto/create-room_type.dto';
import { UpdateRoomTypeDto } from './dto/update-room_type.dto';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Amenity } from '../amenities/entities/amenity.entity';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const hotel = await this.hotelRepository.findOneOrFail({
      where: { id: createRoomTypeDto.hotel_id },
    });
    const amenities = await this.amenityRepository.findBy({
      id: In(createRoomTypeDto.amenities),
    });
    const roomType = this.roomTypeRepository.create({
      ...createRoomTypeDto,
      hotel,
      amenities,
    });
    roomType.hotel = hotel;
    roomType.amenities = amenities;
    return await this.roomTypeRepository.save(roomType);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: RoomType[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { name, description, capacity_adult, capacity_children } =
      advancedSearchDto;

    const query = this.roomTypeRepository
      .createQueryBuilder('roomType')
      .leftJoinAndSelect('roomType.hotel', 'hotel')
      .leftJoinAndSelect('roomType.amenities', 'amenities')
      .leftJoinAndSelect('roomType.rooms', 'rooms');

    if (name) {
      query.andWhere('roomType.name ILIKE :name', { name: `%${name}%` });
    }

    if (description) {
      query.andWhere('roomType.description ILIKE :description', {
        description: `%${description}%`,
      });
    }
    if (capacity_adult) {
      query.andWhere('roomType.capacity_adult = :capacity_adult', {
        capacity_adult,
      });
    }
    if (capacity_children) {
      query.andWhere('roomType.capacity_children = :capacity_children', {
        capacity_children,
      });
    }
    if (sortField && sortOrder) {
      query.orderBy(`roomType.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<RoomType> {
    return await this.roomTypeRepository.findOneOrFail({
      where: { id },
      relations: ['hotel', 'amenities', 'rooms'],
    });
  }

  async update(
    id: number,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    const roomType = await this.findOne(id);
    Object.assign(roomType, updateRoomTypeDto);
    return await this.roomTypeRepository.save(roomType);
  }

  async remove(id: number): Promise<void> {
    const roomType = await this.findOne(id);
    await this.roomTypeRepository.remove(roomType);
  }
}
