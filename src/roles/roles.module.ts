import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Hotel } from '../hotels/entities/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Hotel, Permission])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
