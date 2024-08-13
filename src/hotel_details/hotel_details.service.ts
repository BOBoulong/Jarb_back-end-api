import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HotelDetail } from './entities/hotel_detail.entity';
import { CreateHotelDetailDto } from './dto/create-hotel_detail.dto';
import { UpdateHotelDetailDto } from './dto/update-hotel_detail.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearch } from './dto/advanced-search.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Injectable()
export class HotelDetailsService {
  constructor(
    @InjectRepository(HotelDetail)
    private hotelDetailRepository: Repository<HotelDetail>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async create(
    createHotelDetailDto: CreateHotelDetailDto,
  ): Promise<HotelDetail> {
    const hotel = await this.hotelRepository.findOneOrFail({
      where: { id: createHotelDetailDto.hotel_id },
    });
    const hotelDetail = this.hotelDetailRepository.create(createHotelDetailDto);
    hotelDetail.hotel = hotel;
    return await this.hotelDetailRepository.save(hotelDetail);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearch,
  ): Promise<{ data: HotelDetail[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { description, address, email, phone } = advancedSearchDto;
    const query = this.hotelDetailRepository.createQueryBuilder('hotelDetail');
    if (description) {
      query.andWhere('hotelDetail.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (address) {
      query.andWhere('hotelDetail.address ILIKE :address', {
        address: `%${address}%`,
      });
    }

    if (email) {
      query.andWhere('hotelDetail.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    if (phone) {
      query.andWhere('hotelDetail.phone ILIKE :phone', {
        phone: `%${phone}%`,
      });
    }

    if (sortField && sortOrder) {
      query.orderBy(`hotelDetail.${sortField}`, sortOrder);
    }
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<HotelDetail> {
    const hotelDetail = await this.hotelDetailRepository.findOneOrFail({
      where: { id },
      relations: ['hotel'],
    });
    return hotelDetail;
  }

  async update(
    id: number,
    updateHotelDetailDto: UpdateHotelDetailDto,
  ): Promise<HotelDetail> {
    const hotelDetail = await this.findOne(id);
    Object.assign(hotelDetail, updateHotelDetailDto);
    return this.hotelDetailRepository.save(hotelDetail);
  }

  async remove(id: number): Promise<void> {
    const hotelDetail = await this.findOne(id);
    await this.hotelDetailRepository.remove(hotelDetail);
  }
}
