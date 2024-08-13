import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { AdvancedSearchDto } from './dto/advanced-search.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    // Create a new user object with the hashed password
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    // Save the user to the database
    return this.userRepository.save(user);
  }

  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   const hotel = await this.hotelRepository.findBy({
  //     id: In(createUserDto.hotels),
  //   });
  //   const role = await this.roleRepository.findBy({
  //     id: In(createUserDto.roles),
  //   });
  //   const user = this.userRepository.create({
  //     ...createUserDto,
  //     hotels: hotel,
  //     roles: role,
  //   });
  //   return this.userRepository.save(user);
  // }

  async getPagination(
    paginationDto: PaginationDto,
    advancedSearchDto: AdvancedSearchDto,
  ): Promise<{ data: User[]; total: number; limit: number }> {
    const { page, limit, sortField, sortOrder } = paginationDto;
    const { name, gmail, isActive } = advancedSearchDto;
    const query = this.userRepository.createQueryBuilder('user');
    // .leftJoinAndSelect('user.hotels', 'hotel')
    // .leftJoinAndSelect('user.roles', 'role');
    if (name) {
      query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (gmail) {
      query.andWhere('user.gmail LIKE :gmail', { gmail: `%${gmail}%` });
    }
    if (isActive !== undefined) {
      query.andWhere('user.isActive = :isActive', { isActive });
    }
    if (sortField && sortOrder) {
      query.orderBy(`user.${sortField}`, sortOrder);
    }
    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, limit };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({
      where: { id },
      relations: ['hotels', 'roles'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    // Check if a new password is provided
    if (updateUserDto.password) {
      const saltRounds = 10;
      // Hash the new password
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async assignRole(userId: number, roleId: number): Promise<User> {
    const existingUserRole = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :userId', { userId })
      .andWhere('role.id = :roleId', { roleId })
      .getOne();

    if (!existingUserRole) {
      const user = await this.findOne(userId);
      user.roles = [...user.roles, { id: roleId } as any];
      return this.userRepository.save(user);
    } else {
      throw new Error('Role already assigned to the user');
    }
  }

  async assignHotel(userId: number, hotelId: number): Promise<User> {
    const user = await this.findOne(userId);
    const hotel = await this.hotelRepository.findOne({
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID "${hotelId}" not found`);
    }
    if (!user.hotels) {
      user.hotels = [];
    }
    if (!user.hotels.some((h) => h.id === hotel.id)) {
      user.hotels.push(hotel);
      return this.userRepository.save(user);
    }
    return user;
  }
}
