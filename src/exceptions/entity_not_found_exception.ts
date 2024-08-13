import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id: number | string) {
    super(`${entityName} with ID: ${id} could not be found`);
    this.name = 'EntityNotFoundException';
  }
}
