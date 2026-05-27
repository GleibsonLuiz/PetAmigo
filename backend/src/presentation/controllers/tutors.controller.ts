import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TutorsService } from '../../application/tutors/tutors.service';
import { CreateTutorDto } from '../dtos/create-tutor.dto';
import { UpdateTutorDto } from '../dtos/update-tutor.dto';
import { JwtAuthGuard } from '../../application/auth/jwt.guard';

@Controller('tutors')
@UseGuards(JwtAuthGuard)
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.tutorsService.findByUserId(req.user.id);
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.tutorsService.findById(id);
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTutorDto) {
    return this.tutorsService.createForUser(req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTutorDto,
  ) {
    return this.tutorsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.tutorsService.delete(id);
  }

  @Get(':id/pets')
  getPets(@Param('id', ParseUUIDPipe) id: string) {
    return this.tutorsService.getPetsByTutor(id);
  }

  @Post(':tutorId/pets/:petId/share')
  sharePet(
    @Param('tutorId', ParseUUIDPipe) tutorId: string,
    @Param('petId', ParseUUIDPipe) petId: string,
  ) {
    return this.tutorsService.sharePet(petId, tutorId);
  }

  @Delete(':tutorId/pets/:petId/share')
  unsharePet(
    @Param('tutorId', ParseUUIDPipe) tutorId: string,
    @Param('petId', ParseUUIDPipe) petId: string,
  ) {
    return this.tutorsService.unsharePet(petId, tutorId);
  }
}
