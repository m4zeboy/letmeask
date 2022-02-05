import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/button';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function Room() {
  const {user} = useAuth()  
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('')
  const roomId= params.id;
  const { questions, title } = useRoom(roomId)

  

  async function handleSendQuestion(event: FormEvent){
    event.preventDefault()

    if(newQuestion.trim() === '') {
      return
    }
    if(!user) {
      // erro
      throw new Error('You must be logged in.')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswerd:  false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask Logo" />
          <RoomCode code={roomId}/>
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
        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você deseja perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={`Avatar de ${user.name}`} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

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