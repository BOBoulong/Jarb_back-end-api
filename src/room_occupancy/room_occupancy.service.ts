import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoomOccupancy } from './entities/room_occupancy.entity';
import { CreateRoomOccupancyDto } from './dto/create-room_occupancy.dto';
import { Room } from '../rooms/entities/room.entity';
import { Amenity } from '../amenities/entities/amenity.entity';
import { Customer } from '../customers/entities/customer.entity';
import { GetRoomOccupancyDto } from './dto/room-occupancy.dto';

@Injectable()
export class RoomOccupancyService {
  constructor(
    @InjectRepository(RoomOccupancy)
    private roomOccupancyRepository: Repository<RoomOccupancy>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}
  async create(
    createRoomOccupancyDto: CreateRoomOccupancyDto,
  ): Promise<RoomOccupancy> {
    const room = await this.roomRepository.findOneOrFail({
      where: { id: createRoomOccupancyDto.room_id },
    });
    const customers = await this.customerRepository.findBy({
      id: In(createRoomOccupancyDto.customer_id),
    });
    const amenities = await this.amenityRepository.findBy({
      id: In(createRoomOccupancyDto.amenities),
    });
    const roomOccupancy = this.roomOccupancyRepository.create({
      ...createRoomOccupancyDto,
      room,
      customers,
      amenities,
    });
    return this.roomOccupancyRepository.save(roomOccupancy);
  }

  async getAll(filters: GetRoomOccupancyDto): Promise<RoomOccupancy[]> {
    const queryBuilder =
      this.roomOccupancyRepository.createQueryBuilder('room_occupancy');

    if (filters.checkedInStartDate) {
      queryBuilder.andWhere(
        'room_occupancy.checked_in_time >= :checkedInStartDate',
        {
          checkedInStartDate: filters.checkedInStartDate,
        },
      );
    }

    if (filters.checkedInEndDate) {
      queryBuilder.andWhere(
        'room_occupancy.checked_in_time <= :checkedInEndDate',
        {
          checkedInEndDate: filters.checkedInEndDate,
        },
      );
    }

    if (filters.checkoutStartDate) {
      queryBuilder.andWhere(
        'room_occupancy.expected_checkout_time >= :checkoutStartDate',
        {
          checkoutStartDate: filters.checkoutStartDate,
        },
      );
    }

    if (filters.checkoutEndDate) {
      queryBuilder.andWhere(
        'room_occupancy.expected_checkout_time <= :checkoutEndDate',
        {
          checkoutEndDate: filters.checkoutEndDate,
        },
      );
    }

    return queryBuilder.getMany();
  }

  async remove(id: number): Promise<void> {
    await this.roomOccupancyRepository.delete(id);
  }
}
