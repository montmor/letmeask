import './style.scss';
import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useContext, FormEvent, useState } from "react";

import { database } from "../../services/firebase";

export function NewRoom() {
    const { user } = useContext(AuthContext);
    const [newRoom, setNewRoom] = useState("");
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        
        if (newRoom.trim() === '') {
            return;
        }
        
        //referencia no banco de dados para consultar
        const roomRef = database.ref("rooms");
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            avatar: user?.avatar,
            name: user?.name,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h1>{ user?.name}</h1>
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                </div>                    
            </main>
        </div>
    )
}
