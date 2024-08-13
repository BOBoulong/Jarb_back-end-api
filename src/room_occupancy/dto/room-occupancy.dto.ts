import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRoomOccupancyDto {
  @IsOptional()
  @Type(() => Date)
  checkedInStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  checkedInEndDate?: Date;

  @IsOptional()
  @Type(() => Date)
  checkoutStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  checkoutEndDate?: Date;
}
