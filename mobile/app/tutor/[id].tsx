import React from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTutor, useUpdateTutor } from '../../src/presentation/hooks/useTutors';
import { useTutorStore } from '../../src/presentation/stores/tutorStore';
import { TutorForm } from '../../src/presentation/components/tutor/TutorForm';
import { LoadingSpinner } from '../../src/presentation/components/shared/LoadingSpinner';
import { CreateTutorInput } from '../../src/domain/entities/Tutor';

export default function EditTutorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: tutor, isLoading } = useTutor(id);
  const updateTutor = useUpdateTutor();

  if (isLoading) return <LoadingSpinner />;
  if (!tutor) return null;

  const handleSubmit = (data: CreateTutorInput) => {
    updateTutor.mutate({ id, ...data }, {
      onSuccess: (updated) => {
        const store = useTutorStore.getState();
        if (store.activeTutorId === id) {
          store.setActiveTutor(updated);
        }
        Alert.alert('Atualizado!', 'Perfil salvo com sucesso.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert('Erro', 'Não foi possível salvar.');
      },
    });
  };

  return (
    <TutorForm
      onSubmit={handleSubmit}
      isLoading={updateTutor.isPending}
      initialData={{ name: tutor.name, email: tutor.email, phone: tutor.phone, avatarUrl: tutor.avatarUrl }}
      submitLabel="Salvar Alterações"
    />
  );
}
