import React from 'react';
import { useRouter } from 'expo-router';
import { PetForm } from '../components/pet/PetForm';
import { useCreatePet } from '../hooks/usePets';
import { CreatePetInput } from '../../domain/entities/Pet';
import { notify } from '../../shared/utils/notify';

export function CreatePetScreen() {
  const router = useRouter();
  const createPet = useCreatePet();

  const handleSubmit = (data: CreatePetInput) => {
    createPet.mutate(data, {
      onSuccess: () => {
        notify('Pronto! 🎉', `${data.name} foi cadastrado com sucesso!`, () => router.back());
      },
      onError: () => {
        notify('Ops! 😿', 'Não foi possível cadastrar o pet. Tente novamente.');
      },
    });
  };

  return <PetForm onSubmit={handleSubmit} isLoading={createPet.isPending} />;
}
