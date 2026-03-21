import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommercesDto {
  @IsNotEmpty({ message: 'Latitude is required' })
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @IsNotEmpty({ message: 'Longitude is required' })
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  category?: string;
}
