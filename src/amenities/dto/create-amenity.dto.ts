import { IsString, IsBoolean, IsOptional } from 'class-validator';
export class CreateAmenityDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly group?: string;

  @IsBoolean()
  @IsOptional()
  readonly hasExtraCharge?: boolean;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
