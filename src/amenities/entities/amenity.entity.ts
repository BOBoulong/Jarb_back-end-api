import { RoomType } from 'src/room_types/entities/room_type.entity';
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../baseEntity/base.entity';
import { RoomOccupancy } from '../../room_occupancy/entities/room_occupancy.entity';

@Entity('amenities')
export class Amenity extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  group: string;

  @Column({ name: 'has_extra_charge', default: false, nullable: false })
  hasExtraCharge: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => RoomType, (roomType) => roomType.amenities)
  roomTypes: RoomType[];

  @ManyToMany(() => RoomOccupancy, (roomOccupancy) => roomOccupancy.amenities)
  roomOccupancies: RoomOccupancy[];
}
