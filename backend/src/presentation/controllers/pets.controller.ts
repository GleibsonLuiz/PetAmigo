import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PetsService } from '../../application/pets/pets.service';
import { CreatePetDto } from '../dtos/create-pet.dto';
import { UpdatePetDto } from '../dtos/update-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  private getTutorId(tutorId?: string): string {
    if (!tutorId) throw new BadRequestException('Header x-tutor-id é obrigatório');
    return tutorId;
  }

  @Get()
  findAll(@Headers('x-tutor-id') tutorId?: string) {
    return this.petsService.findAll(this.getTutorId(tutorId));
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findById(id);
  }

  @Post()
  create(
    @Headers('x-tutor-id') tutorId: string,
    @Body() dto: CreatePetDto,
  ) {
    return this.petsService.create(this.getTutorId(tutorId), dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePetDto,
  ) {
    return this.petsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.delete(id);
  }
}
