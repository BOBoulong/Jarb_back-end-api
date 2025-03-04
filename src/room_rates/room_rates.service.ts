import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRate } from './entities/room_rate.entity';
import { CreateRoomRateDto } from './dto/create-room_rate.dto';
import { UpdateRoomRateDto } from './dto/update-room_rate.dto';
import { RoomType } from 'src/room_types/entities/room_type.entity';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Injectable()
export class RoomRateService {
  constructor(
    @InjectRepository(RoomRate)
    private roomRateRepository: Repository<RoomRate>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(createRoomRateDto: CreateRoomRateDto): Promise<RoomRate> {
    const roomType = await this.roomTypeRepository.findOneOrFail({
      where: { id: createRoomRateDto.room_type_id },
    });
    const roomRate = this.roomRateRepository.create({
      ...createRoomRateDto,
    });
    roomRate.roomType = roomType;
    return await this.roomRateRepository.save(roomRate);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: RoomRate[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const {
      name,
      description,
      default_rate,
      weekend_rate,
      start_date,
      end_date,
    } = advancedSearchDto;

    const query = this.roomRateRepository
      .createQueryBuilder('roomRate')
      .leftJoinAndSelect('roomRate.roomType', 'roomType');

    if (name) {
      query.andWhere('roomRate.name ILIKE :name', { name: `%${name}%` });
    }

    if (description) {
      query.andWhere('roomRate.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (default_rate !== undefined) {
      query.andWhere('roomRate.default_rate = :default_rate', {
        default_rate,
      });
    }

    if (weekend_rate !== undefined) {
      query.andWhere('roomRate.weekend_rate = :weekend_rate', {
        weekend_rate,
      });
    }

    if (start_date && end_date) {
      query.andWhere('roomRate.start_date BETWEEN :start_date AND :end_date', {
        start_date,
        end_date,
      });
    } else if (start_date) {
      query.andWhere('roomRate.start_date >= :start_date', {
        start_date,
      });
    } else if (end_date) {
      query.andWhere('roomRate.start_date <= :end_date', {
        end_date,
      });
    }

    if (sortField && sortOrder) {
      query.orderBy(`roomRate.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<RoomRate> {
    return await this.roomRateRepository.findOneOrFail({
      where: { id },
      relations: ['roomType'],
    });
  }

  async update(
    id: number,
    updateRoomRateDto: UpdateRoomRateDto,
  ): Promise<RoomRate> {
    const roomRate = await this.findOne(id);
    Object.assign(roomRate, updateRoomRateDto);
    return this.roomRateRepository.save(roomRate);
  }

  async remove(id: number): Promise<void> {
    const roomRate = await this.findOne(id);
    await this.roomRateRepository.remove(roomRate);
  }
}
