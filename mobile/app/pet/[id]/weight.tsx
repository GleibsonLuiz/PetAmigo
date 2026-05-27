import React from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../../src/presentation/hooks/usePets';
import { useWeight, useCreateWeight } from '../../../src/presentation/hooks/useWeight';
import { WeightForm } from '../../../src/presentation/components/weight/WeightForm';
import { LoadingSpinner } from '../../../src/presentation/components/shared/LoadingSpinner';
import { CreateWeightInput } from '../../../src/domain/entities/Weight';

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
        Alert.alert('Registrado! ⚖️', `Peso de ${pet.name} atualizado.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Erro', 'Não foi possível registrar o peso.');
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
