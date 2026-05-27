import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { TutorForm } from '../components/tutor/TutorForm';
import { useCreateTutor } from '../hooks/useTutors';
import { useTutorStore } from '../stores/tutorStore';
import { CreateTutorInput } from '../../domain/entities/Tutor';

export function CreateTutorScreen() {
  const router = useRouter();
  const createTutor = useCreateTutor();

  const handleSubmit = (data: CreateTutorInput) => {
    createTutor.mutate(data, {
      onSuccess: (tutor) => {
        useTutorStore.getState().setActiveTutor(tutor);
        Alert.alert('Pronto! 🎉', `${data.name} foi cadastrado!`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Ops!', 'Não foi possível cadastrar o tutor.');
      },
    });
  };

  return <TutorForm onSubmit={handleSubmit} isLoading={createTutor.isPending} />;
}
