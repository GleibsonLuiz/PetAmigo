import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TutorRepositoryImpl } from '../../infrastructure/repositories/TutorRepositoryImpl';
import { CreateTutorInput, UpdateTutorInput } from '../../domain/entities/Tutor';

const tutorRepo = new TutorRepositoryImpl();

export function useTutors() {
  return useQuery({
    queryKey: ['tutors'],
    queryFn: () => tutorRepo.findAll(),
  });
}

export function useTutor(id: string) {
  return useQuery({
    queryKey: ['tutors', id],
    queryFn: () => tutorRepo.findById(id),
    enabled: !!id,
  });
}

export function useCreateTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTutorInput) => tutorRepo.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTutorInput) => tutorRepo.update(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
      queryClient.invalidateQueries({ queryKey: ['tutors', variables.id] });
    },
  });
}

export function useDeleteTutor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tutorRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] });
    },
  });
}
