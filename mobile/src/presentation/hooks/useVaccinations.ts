import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VaccinationRepositoryImpl } from '../../infrastructure/repositories/VaccinationRepositoryImpl';
import { CreateVaccinationInput } from '../../domain/entities/Vaccination';

const vaccinationRepo = new VaccinationRepositoryImpl();

export function useVaccinations(petId: string) {
  return useQuery({
    queryKey: ['vaccinations', petId],
    queryFn: () => vaccinationRepo.findByPetId(petId),
    enabled: !!petId,
  });
}

export function useAvailableVaccines(species: string) {
  return useQuery({
    queryKey: ['vaccines', species],
    queryFn: () => vaccinationRepo.getAvailableVaccines(species),
    enabled: !!species,
  });
}

export function useCreateVaccination() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVaccinationInput) => vaccinationRepo.create(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', variables.petId] });
    },
  });
}

export function useDeleteVaccination(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vaccinationRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccinations', petId] });
    },
  });
}
