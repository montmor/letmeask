import '../AdminRoom/style.scss';
import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  // const { user } = useAuth();
  const { questions, title } = useRoom(roomId);

  function handleRedirectHome() {
    history.push('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    handleRedirectHome();
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnsered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighLighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" title="Letmeask" onClick={handleRedirectHome} />
          <div>
            <RoomCode code={params.id} />
            <Button isOutLined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                author={question.author}
                content={question.content}
                isAnsered={question.isAnsered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnsered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                        title="Marcar pergunta como respondida"
                      />
                    </button>

                    <button type="button" onClick={() => handleHighLightQuestion(question.id)}>
                      <img
                        src={answerImg}
                        alt="Dar destaque à pergunta"
                        title="Dar destaque à pergunta"
                      />
                    </button>
                  </>
                )}

                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover pergunta" title="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
