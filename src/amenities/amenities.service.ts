import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity)
    private readonly amenityRepository: Repository<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    const amenity = this.amenityRepository.create(createAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: Amenity[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { name, group, has_extra_charge, description } = advancedSearchDto;

    const query = this.amenityRepository.createQueryBuilder('amenity');

    if (name) {
      query.andWhere('amenity.name ILIKE :name', { name: `%${name}%` });
    }
    if (group) {
      query.andWhere('amenity.group ILIKE :group', { group: `%${group}%` });
    }
    if (has_extra_charge !== undefined) {
      query.andWhere('amenity.has_extra_charge = :has_extra_charge', {
        has_extra_charge,
      });
    }
    if (description) {
      query.andWhere('amenity.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (sortField && sortOrder) {
      query.orderBy(`amenity.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<Amenity> {
    return await this.amenityRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(
    id: number,
    updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    const amenity = await this.findOne(id);
    Object.assign(amenity, updateAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async remove(id: number): Promise<void> {
    const amenity = await this.findOne(id);
    await this.amenityRepository.remove(amenity);
  }
}
