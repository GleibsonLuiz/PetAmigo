import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from '../../presentation/controllers/tutors.controller';
import { TutorRepositoryPort } from '../../domain/repositories/tutor.repository';
import { TutorRepositoryPg } from '../../infrastructure/repositories/tutor.repository.pg';

@Module({
  controllers: [TutorsController],
  providers: [
    TutorsService,
    { provide: TutorRepositoryPort, useClass: TutorRepositoryPg },
  ],
  exports: [TutorsService],
})
export class TutorsModule {}
