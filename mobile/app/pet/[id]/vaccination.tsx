import React from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePet } from '../../../src/presentation/hooks/usePets';
import { useAvailableVaccines, useCreateVaccination } from '../../../src/presentation/hooks/useVaccinations';
import { VaccinationForm } from '../../../src/presentation/components/vaccination/VaccinationForm';
import { LoadingSpinner } from '../../../src/presentation/components/shared/LoadingSpinner';
import { CreateVaccinationInput } from '../../../src/domain/entities/Vaccination';

export default function AddVaccinationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isLoading: loadingPet } = usePet(id);
  const { data: vaccines, isLoading: loadingVaccines } = useAvailableVaccines(pet?.species ?? '');
  const createVaccination = useCreateVaccination();

  if (loadingPet || loadingVaccines) return <LoadingSpinner />;
  if (!pet) return null;

  const handleSubmit = (data: CreateVaccinationInput) => {
    createVaccination.mutate(data, {
      onSuccess: () => {
        Alert.alert('Registrado! 💉', `Vacina de ${pet.name} registrada com sucesso.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Erro', 'Não foi possível registrar a vacina.');
      },
    });
  };

  return (
    <VaccinationForm
      petId={id}
      petName={pet.name}
      vaccines={vaccines ?? []}
      onSubmit={handleSubmit}
      isLoading={createVaccination.isPending}
    />
  );
}
