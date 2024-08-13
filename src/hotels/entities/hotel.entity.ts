import { HotelDetail } from 'src/hotel_details/entities/hotel_detail.entity';
import { RoomType } from 'src/room_types/entities/room_type.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { BaseEntity } from '../../baseEntity/base.entity';
import { Entity, Column, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('hotels')
export class Hotel extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @OneToMany(() => RoomType, (roomType) => roomType.hotel)
  roomTypes: RoomType[];

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];

  @OneToOne(() => HotelDetail, (hotelDetail) => hotelDetail.hotel, {
    cascade: true,
  })
  hotelDetail: HotelDetail[];

  @ManyToMany(() => User, (user) => user.hotels)
  users: User[];

  @ManyToMany(() => Role, (role) => role.hotels, {
    cascade: true,
  })
  roles: Role[];
}
