import { Injectable, NotFoundException } from '@nestjs/common';
import { VaccinationRepositoryPort } from '../../domain/repositories/vaccination.repository';
import { VaccinationRecord } from '../../domain/entities/vaccination-record.entity';
import { Vaccine } from '../../domain/entities/vaccine.entity';
import { CreateVaccinationDto } from '../../presentation/dtos/create-vaccination.dto';

@Injectable()
export class VaccinationsService {
  constructor(private readonly vaccinationRepo: VaccinationRepositoryPort) {}

  async findByPetId(petId: string): Promise<VaccinationRecord[]> {
    return this.vaccinationRepo.findByPetId(petId);
  }

  async create(petId: string, dto: CreateVaccinationDto): Promise<VaccinationRecord> {
    const vaccine = await this.vaccinationRepo.findVaccineById(dto.vaccineId);
    if (!vaccine) throw new NotFoundException('Vacina não encontrada');

    const applicationDate = new Date(dto.applicationDate);
    const nextDoseDate = new Date(applicationDate);
    nextDoseDate.setMonth(nextDoseDate.getMonth() + vaccine.periodicityMonths);

    return this.vaccinationRepo.create({
      petId,
      vaccineId: dto.vaccineId,
      applicationDate,
      nextDoseDate,
      veterinarian: dto.veterinarian,
      notes: dto.notes,
    });
  }

  async delete(id: string): Promise<void> {
    const record = await this.vaccinationRepo.findById(id);
    if (!record) throw new NotFoundException('Registro de vacinação não encontrado');
    return this.vaccinationRepo.delete(id);
  }

  async getVaccinesBySpecies(species: string): Promise<Vaccine[]> {
    return this.vaccinationRepo.getVaccinesBySpecies(species);
  }
}
