import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { PetForm } from '../components/pet/PetForm';
import { useCreatePet } from '../hooks/usePets';
import { CreatePetInput } from '../../domain/entities/Pet';

export function CreatePetScreen() {
  const router = useRouter();
  const createPet = useCreatePet();

  const handleSubmit = (data: CreatePetInput) => {
    createPet.mutate(data, {
      onSuccess: () => {
        Alert.alert('Pronto! 🎉', `${data.name} foi cadastrado com sucesso!`, [
          { text: 'Ver meus pets', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Ops! 😿', 'Não foi possível cadastrar o pet. Tente novamente.');
      },
    });
  };

  return <PetForm onSubmit={handleSubmit} isLoading={createPet.isPending} />;
}
