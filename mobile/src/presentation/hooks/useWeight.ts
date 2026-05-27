import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../infrastructure/api/client';
import { WeightRecord, CreateWeightInput } from '../../domain/entities/Weight';

export function useWeight(petId: string) {
  return useQuery<WeightRecord[]>({
    queryKey: ['weight', petId],
    queryFn: () => api.get(`/pets/${petId}/weight`),
    enabled: !!petId,
  });
}

export function useCreateWeight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWeightInput) =>
      api.post(`/pets/${input.petId}/weight`, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weight', variables.petId] });
    },
  });
}
