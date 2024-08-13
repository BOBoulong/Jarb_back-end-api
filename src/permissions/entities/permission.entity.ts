import { BaseEntity } from 'src/baseEntity/base.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column({ name: 'resource_name', nullable: true })
  resourceName: string;

  @Column({ name: 'resource_action' })
  resourceAction: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
