import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsInt()
  readonly hotel_id: number;

  @IsArray()
  @ArrayNotEmpty()
  readonly permission: number[];
}
