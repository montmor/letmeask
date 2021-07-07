import { useState, useEffect } from "react";
import { database } from "../services/firebase/index"

type QuestionType = {
    id: string,
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnsered: boolean;
    isHighLighted: boolean;
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


export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
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
    
    return { questions, title }

}