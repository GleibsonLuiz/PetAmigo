import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../../src/presentation/hooks/usePets';
import { useWeight, useCreateWeight } from '../../../src/presentation/hooks/useWeight';
import { WeightForm } from '../../../src/presentation/components/weight/WeightForm';
import { LoadingSpinner } from '../../../src/presentation/components/shared/LoadingSpinner';
import { CreateWeightInput } from '../../../src/domain/entities/Weight';
import { notify } from '../../../src/shared/utils/notify';

export default function AddWeightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isLoading: loadingPet } = usePet(id);
  const { data: records } = useWeight(id);
  const createWeight = useCreateWeight();

  if (loadingPet) return <LoadingSpinner />;
  if (!pet) return null;

  const lastWeight = records?.length
    ? records[records.length - 1].weightKg
    : undefined;

  const handleSubmit = (data: CreateWeightInput) => {
    createWeight.mutate(data, {
      onSuccess: () => {
        notify('Registrado! ⚖️', `Peso de ${pet.name} atualizado.`, () => router.back());
      },
      onError: () => {
        notify('Erro', 'Não foi possível registrar o peso.');
      },
    });
  };

  return (
    <WeightForm
      petId={id}
      petName={pet.name}
      lastWeight={lastWeight}
      onSubmit={handleSubmit}
      isLoading={createWeight.isPending}
    />
  );
}
