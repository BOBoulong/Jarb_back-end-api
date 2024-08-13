import { BaseEntity } from 'src/baseEntity/base.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: true })
  gmail: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @Column({ name: 'is_google', type: 'boolean', default: false})
  isGoogle: boolean;

  @ManyToMany(() => Hotel)
  @JoinTable({
    name: 'user_hotel',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'hotel_id', referencedColumnName: 'id' },
  })
  hotels: Hotel[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
