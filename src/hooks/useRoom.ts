import { useState, useEffect } from 'react';
import { database } from '../services/firebase/index';
import { useAuth } from './useAuth';

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnsered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  hasLiked: boolean;
};

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnsered: boolean;
    isHighLighted: boolean;
    likes: Record<
      string,
      {
        authorId: string;
      }
    >;
  }
>;

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const { user } = useAuth();

  //É um Hook que dispara um evento, quando alguma informação mudar
  //Quando eu passo o array de dependencia vazio, a função executa uma única vez quando o componente for criado.
  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      //console.log(room.val());
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isAnsered: value.isAnsered,
          isHighLighted: value.isHighLighted,
          likeCount: Object.values(value.likes ?? {}).length,
          hasLiked: Object.values(value.likes ?? {}).some((like) => like.authorId === user?.id),
        };
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
      console.log(parsedQuestions);
    });
    return () => {
      roomRef.off('value');
    };
  }, [roomId, user?.id]);

  return { questions, title };
}
