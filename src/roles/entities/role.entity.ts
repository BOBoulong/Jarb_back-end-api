import { BaseEntity } from 'src/baseEntity/base.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: false, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Hotel, (hotel) => hotel.roles)
  @JoinTable({
    name: 'hotel_role',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'hotel_id', referencedColumnName: 'id' },
  })
  hotels: Hotel[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];
}
