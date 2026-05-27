import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GroomingService } from '../../application/grooming/grooming.service';
import { CreateGroomingDto } from '../dtos/create-grooming.dto';

@Controller()
export class GroomingController {
  constructor(private readonly groomingService: GroomingService) {}

  @Get('pets/:petId/grooming')
  findByPetId(@Param('petId', ParseUUIDPipe) petId: string) {
    return this.groomingService.findByPetId(petId);
  }

  @Post('pets/:petId/grooming')
  create(
    @Param('petId', ParseUUIDPipe) petId: string,
    @Body() dto: CreateGroomingDto,
  ) {
    return this.groomingService.create(petId, dto);
  }

  @Delete('grooming/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.groomingService.delete(id);
  }
}
