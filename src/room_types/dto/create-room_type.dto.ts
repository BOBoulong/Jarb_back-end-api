import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsInt()
  readonly capacityAdult: number;

  @IsInt()
  @IsOptional()
  readonly capacityChildren?: number;

  @IsInt()
  readonly hotel_id: number;

  @IsArray()
  @ArrayNotEmpty()
  readonly amenities: number[];
}
