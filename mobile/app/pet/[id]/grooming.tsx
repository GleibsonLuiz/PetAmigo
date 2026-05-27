import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../../src/presentation/hooks/usePets';
import { useCreateGrooming } from '../../../src/presentation/hooks/useGrooming';
import { GroomingForm } from '../../../src/presentation/components/grooming/GroomingForm';
import { LoadingSpinner } from '../../../src/presentation/components/shared/LoadingSpinner';
import { CreateGroomingInput } from '../../../src/domain/entities/Grooming';
import { notify } from '../../../src/shared/utils/notify';

export default function AddGroomingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isLoading } = usePet(id);
  const createGrooming = useCreateGrooming();

  if (isLoading) return <LoadingSpinner />;
  if (!pet) return null;

  const handleSubmit = (data: CreateGroomingInput) => {
    createGrooming.mutate(data, {
      onSuccess: () => {
        notify('Registrado! 🛁', `Banho de ${pet.name} registrado com sucesso.`, () => router.back());
      },
      onError: () => {
        notify('Erro', 'Não foi possível registrar o banho.');
      },
    });
  };

  return (
    <GroomingForm
      petId={id}
      petName={pet.name}
      onSubmit={handleSubmit}
      isLoading={createGrooming.isPending}
    />
  );
}
