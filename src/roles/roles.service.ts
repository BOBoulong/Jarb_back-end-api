import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const hotel = await this.hotelRepository.findOneOrFail({
      where: { id: createRoleDto.hotel_id },
    });
    const permission = await this.permissionRepository.findBy({
      id: In(createRoleDto.permission),
    });
    const role = this.roleRepository.create({
      ...createRoleDto,
      hotels: [hotel],
      permissions: permission,
    });
    return await this.roleRepository.save(role);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: Role[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { name, description } = advancedSearchDto;

    const query = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.hotels', 'hotel')
      .leftJoinAndSelect('role.permissions', 'permission');

    if (name) {
      query.andWhere('role.name ILIKE :name', { name: `%${name}%` });
    }

    if (description) {
      query.andWhere('role.description ILIKE :description', {
        description: `%${description}%`,
      });
    }

    if (sortField && sortOrder) {
      query.orderBy(`role.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<Role> {
    return await this.roleRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
