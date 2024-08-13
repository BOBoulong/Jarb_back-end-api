import { IsInt, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateRoomOccupancyDto {
  @IsOptional()
  @IsNotEmpty()
  checked_in_time: Date;

  @IsOptional()
  @IsNotEmpty()
  expected_checkout_time: Date;

  @IsArray()
  @IsInt({ each: true })
  customer_id: number[];

  @IsInt()
  @IsNotEmpty()
  room_id: number;

  @IsArray()
  @IsInt({ each: true })
  amenities: number[];
}
