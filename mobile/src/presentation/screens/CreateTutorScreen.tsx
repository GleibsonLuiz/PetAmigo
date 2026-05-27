import React from 'react';
import { useRouter } from 'expo-router';
import { TutorForm } from '../components/tutor/TutorForm';
import { useCreateTutor } from '../hooks/useTutors';
import { useTutorStore } from '../stores/tutorStore';
import { CreateTutorInput } from '../../domain/entities/Tutor';
import { notify } from '../../shared/utils/notify';

export function CreateTutorScreen() {
  const router = useRouter();
  const createTutor = useCreateTutor();

  const handleSubmit = (data: CreateTutorInput) => {
    createTutor.mutate(data, {
      onSuccess: (tutor) => {
        useTutorStore.getState().setActiveTutor(tutor);
        notify('Pronto! 🎉', `${data.name} foi cadastrado!`, () => router.back());
      },
      onError: () => {
        notify('Ops!', 'Não foi possível cadastrar o tutor.');
      },
    });
  };

  return <TutorForm onSubmit={handleSubmit} isLoading={createTutor.isPending} />;
}
