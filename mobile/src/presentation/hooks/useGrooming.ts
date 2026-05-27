import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroomingRepositoryImpl } from '../../infrastructure/repositories/GroomingRepositoryImpl';
import { CreateGroomingInput } from '../../domain/entities/Grooming';

const groomingRepo = new GroomingRepositoryImpl();

export function useGrooming(petId: string) {
  return useQuery({
    queryKey: ['grooming', petId],
    queryFn: () => groomingRepo.findByPetId(petId),
    enabled: !!petId,
  });
}

export function useAllGrooming(petIds: string[]) {
  const queries = useQueries({
    queries: petIds.map((petId) => ({
      queryKey: ['grooming', petId],
      queryFn: () => groomingRepo.findByPetId(petId),
      enabled: !!petId,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const data = isLoading ? undefined : queries.flatMap((q) => q.data ?? []);

  return { data, isLoading };
}

export function useCreateGrooming() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGroomingInput) => groomingRepo.create(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grooming', variables.petId] });
    },
  });
}

export function useDeleteGrooming(petId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groomingRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grooming', petId] });
    },
  });
}
