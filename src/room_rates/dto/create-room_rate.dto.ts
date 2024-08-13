import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomRateDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly defaultRate?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  readonly weekendRate?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  readonly endDate?: Date;

  @IsInt()
  @IsNotEmpty()
  readonly room_type_id: number;
}
