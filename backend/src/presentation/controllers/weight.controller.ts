import { Controller, Get, Post, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { WeightService } from '../../application/weight/weight.service';
import { CreateWeightDto } from '../dtos/create-weight.dto';

@Controller()
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get('pets/:petId/weight')
  findByPetId(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.weightService.findByPetId(petId);
  }

  @Post('pets/:petId/weight')
  create(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() dto: CreateWeightDto,
  ) {
    return this.weightService.create(petId, dto);
  }

  @Delete('weight/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.weightService.delete(id);
  }
}
