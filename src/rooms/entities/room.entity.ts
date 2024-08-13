import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../baseEntity/base.entity';
import { RoomType } from 'src/room_types/entities/room_type.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { RoomOccupancy } from '../../room_occupancy/entities/room_occupancy.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  floor: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn({ name: 'room_type_id', referencedColumnName: 'id' })
  roomType: RoomType;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes)
  @JoinColumn({ name: 'hotel_id', referencedColumnName: 'id' })
  hotel: Hotel;

  @OneToMany(() => RoomOccupancy, (roomOccupancy) => roomOccupancy.room)
  roomOccupancy: RoomOccupancy[];
}
