import "./Room.scss";
import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button/Button";
import { RoomCode } from "../../components/RoomCode/RoomCode";

import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { database } from "../../services/firebase/firebase";

type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnsered: boolean;
    isHighLighted: boolean;
}>

type Question = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnsered: boolean;
    isHighLighted: boolean;
}

export function Room() {
    const params = useParams<RoomParams>();
    const history = useHistory();
    const roomId = params.id;
    const [newQuestion, setNewQuestion] = useState("");
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState("");

    //É um Hook que dispara um evento, quando alguma informação mudar
    //Quando eu passo o array de dependencia vazio, a função executa uma única vez quando o componente for criado. 
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        
        roomRef.on('value', room => {
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
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
            console.log(parsedQuestions);
        })
    }, [roomId]);

    function handleRedirectHome() {
        history.push("/");
    }

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === "") {
            alert("Digite sua pergunta...");
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

        setNewQuestion("");
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
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que voce quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    
                    <div className="form-footer">

                        {user ?
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                            :
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        }

                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                {JSON.stringify(questions)}

            </main>
        </div>
    );
}