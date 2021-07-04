import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import { Button } from '../../components/Button/Button';

import './Home.scss';

import { useHistory } from "react-router-dom";

<<<<<<< HEAD
import { useAuth } from "../../hooks/useAuth";
=======
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useContext } from 'react';

import { useAuth } from "../../hooks/useAuth";


>>>>>>> 8e34834c33268bed9b8d5e7b804560d4ca43847c

export function Home() {
    const history = useHistory();
    const { user, signInWithGoogle } = useAuth();

    async function handleCreateRoom() {
        if (!user) {
           await signInWithGoogle()
        } 
        history.push("/rooms/new");
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
                    <img src={logoImg} alt="Letmeask"/>
                    <button onClick={handleCreateRoom}  className="create-room" >
                        <img src={googleIconImg} alt="Logo do Google"/>
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>                    
            </main>
        </div>
    )
}
