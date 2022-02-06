import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import '../../styles/room.scss';
import { database } from '../../services/firebase';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function Room() {
  const {user} = useAuth()  
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('')
  const roomId = params.id;
  const { questions, title, isEnded } = useRoom(roomId)  

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

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if(likeId) {
      // remover like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    } else {
      // adicionar like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id
      })
    }
  }

  useEffect(() => {

  }, [])

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask Logo" />
          <RoomCode code={roomId}/>
        </div>
      </header>

      { isEnded ? <div>Sala encerrada</div> : (
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
                >
                  <button 
                    className={`like-button ${question.likeId && 'liked'}` }
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.4 5.25C5.61914 5.25 3.25 7.3293 3.25 10.0298C3.25 11.8927 4.12235 13.4612 5.27849 14.7604C6.43066 16.0552 7.91714 17.142 9.26097 18.0516L11.5796 19.6211C11.8335 19.793 12.1665 19.793 12.4204 19.6211L14.739 18.0516C16.0829 17.142 17.5693 16.0552 18.7215 14.7604C19.8777 13.4612 20.75 11.8927 20.75 10.0298C20.75 7.3293 18.3809 5.25 15.6 5.25C14.1665 5.25 12.9052 5.92214 12 6.79183C11.0948 5.92214 9.83347 5.25 8.4 5.25Z" fill="#777"/>
                    </svg>

                  </button>
                </Question>
              )
            })}
          </div>
        </main>
      )}
    </div>
  )
}