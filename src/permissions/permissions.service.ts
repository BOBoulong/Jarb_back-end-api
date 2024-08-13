import { PaginationDto } from './../hotel_details/dto/pagination.dto';
import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdvancedSearchDto } from './dto/advanced-search.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: Permission[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { code, resourceName, resourceAction, description } =
      advancedSearchDto;
    const query = this.permissionRepository.createQueryBuilder('permission');
    if (code) {
      query.andWhere('permission.code = :code', { code });
    }
    if (resourceName) {
      query.andWhere('permission.resource_name = :resourceName', {
        resourceName,
      });
    }
    if (resourceAction) {
      query.andWhere('permission.resource_action = :resourceAction', {
        resourceAction,
      });
    }
    if (description) {
      query.andWhere('permission.description = :description', { description });
    }
    if (sortField && sortOrder) {
      query.orderBy(`permission.${sortField}`, sortOrder);
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<Permission> {
    return await this.permissionRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }
}
