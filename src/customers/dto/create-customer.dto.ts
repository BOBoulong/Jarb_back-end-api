import { IsString, IsOptional } from 'class-validator';
export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly id_number?: string;

  @IsOptional()
  readonly age?: number;

  @IsString()
  @IsOptional()
  readonly gender?: string;

  @IsString()
  @IsOptional()
  readonly phone?: string;
}
