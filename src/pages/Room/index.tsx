import './style.scss';
import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question';

import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();
  const { questions, title } = useRoom(roomId);

  function handleRedirectHome() {
    history.push('/');
  }

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      alert('Digite sua pergunta...');
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighLighted: false,
      isAnsered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" onClick={handleRedirectHome} />
          <RoomCode code={params.id} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que voce quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}

            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question key={question.id} author={question.author} content={question.content} />
            );
          })}
        </div>
      </main>
    </div>
  );
}
