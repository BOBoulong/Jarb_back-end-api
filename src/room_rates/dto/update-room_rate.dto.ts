import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from 'src/hotels/dto/create-hotel.dto';

export class UpdateRoomRateDto extends PartialType(CreateHotelDto) {}
