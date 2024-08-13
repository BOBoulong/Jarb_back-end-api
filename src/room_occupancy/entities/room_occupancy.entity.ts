import { Room } from '../../rooms/entities/room.entity';
import { Customer } from '../../customers/entities/customer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Amenity } from '../../amenities/entities/amenity.entity';
import { BaseEntity } from '../../baseEntity/base.entity';

@Entity('room_occupancy')
export class RoomOccupancy extends BaseEntity {
  @Column({ type: 'timestamp' })
  checked_in_time: Date;

  @Column({ type: 'timestamp' })
  expected_checkout_time: Date;

  @ManyToMany(() => Customer, (customer) => customer.roomOccupancies)
  @JoinTable({
    name: 'room_occupancy_customers',
    joinColumn: { name: 'room_occupancy_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'customer_id', referencedColumnName: 'id' },
  })
  customers: Customer[];

  @ManyToOne(() => Room, (room) => room.roomOccupancy)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToMany(() => Amenity)
  @JoinTable({
    name: 'room_occupancy_amenities',
    joinColumn: { name: 'room_occupancy', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'amenity_id', referencedColumnName: 'id' },
  })
  amenities: Amenity[];
}
