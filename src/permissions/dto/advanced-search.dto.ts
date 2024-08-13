import { IsOptional, IsString } from 'class-validator';

export class AdvancedSearchDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  resourceName?: string;

  @IsOptional()
  @IsString()
  resourceAction?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
