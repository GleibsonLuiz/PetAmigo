import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PetsService } from '../../application/pets/pets.service';
import { CreatePetDto } from '../dtos/create-pet.dto';
import { UpdatePetDto } from '../dtos/update-pet.dto';

const DEV_OWNER_ID = '00000000-0000-0000-0000-000000000001';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  findAll() {
    return this.petsService.findAll(DEV_OWNER_ID);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.petsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreatePetDto) {
    return this.petsService.create(DEV_OWNER_ID, dto);
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
