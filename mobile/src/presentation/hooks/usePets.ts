import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PetRepositoryImpl } from '../../infrastructure/repositories/PetRepositoryImpl';
import { CreatePetInput, UpdatePetInput } from '../../domain/entities/Pet';

const petRepo = new PetRepositoryImpl();

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: () => petRepo.findAll(),
  });
}

export function usePet(id: string) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => petRepo.findById(id),
    enabled: !!id,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePetInput) => petRepo.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePetInput) => petRepo.update(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['pets', variables.id] });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => petRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}
