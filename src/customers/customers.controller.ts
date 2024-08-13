import { Controller, Post, Delete, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.customerService.remove(id);
    return { message: 'Customer deleted successfully' };
  }
}
