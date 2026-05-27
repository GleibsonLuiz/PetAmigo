import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VaccinationsService } from '../../application/vaccinations/vaccinations.service';
import { CreateVaccinationDto } from '../dtos/create-vaccination.dto';

@Controller()
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get('pets/:petId/vaccinations')
  findByPetId(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.vaccinationsService.findByPetId(petId);
  }

  @Post('pets/:petId/vaccinations')
  create(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() dto: CreateVaccinationDto,
  ) {
    return this.vaccinationsService.create(petId, dto);
  }

  @Delete('vaccinations/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.vaccinationsService.delete(id);
  }

  @Get('vaccines')
  getVaccines(@Query('species') species: string) {
    return this.vaccinationsService.getVaccinesBySpecies(species);
  }
}
