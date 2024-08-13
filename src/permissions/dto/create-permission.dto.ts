import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @IsOptional()
  readonly code: string;

  @IsString()
  @IsOptional()
  readonly resourceName: string;

  @IsString()
  @IsOptional()
  readonly resourceAction: string;

  @IsString()
  @IsOptional()
  readonly description: string;
}
