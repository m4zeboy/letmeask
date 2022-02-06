import { useParams } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const {user} = useAuth()  
  const params = useParams<RoomParams>();
  const roomId= params.id;
  const { questions, title } = useRoom(roomId)

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask Logo" />
          <div>
            <RoomCode code={roomId}/>
            <Button isOutlined >Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { 
            questions.length > 0 && (
              <span>
                {questions.length > 1 ? `${ questions.length} Perguntas` : `${ questions.length} Pergunta`}
              </span>
            )
          }
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question 
                content={question.content}
                author={question.author}
                key={question.id}
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}