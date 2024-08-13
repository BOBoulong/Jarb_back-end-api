import { BaseEntity } from 'src/baseEntity/base.entity';
import { RoomOccupancy } from '../../room_occupancy/entities/room_occupancy.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  id_number: string;

  @Column({ nullable: false })
  age: number;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @ManyToMany(() => RoomOccupancy, (roomOccupancy) => roomOccupancy.customers)
  roomOccupancies: RoomOccupancy[];
}
