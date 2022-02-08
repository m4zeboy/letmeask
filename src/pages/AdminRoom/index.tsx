import { useHistory, useParams } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';
import deleteImage from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';

import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import '../../styles/room.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  // const {user} = useAuth()  
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title, isEnded } = useRoom(roomId)
  console.log(questions)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    history.push('/')
  }

  async function handelDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que deseja excluir essa pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      return
    }
  }

  async function handelCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
    return
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
    return
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask Logo" />
          <div className="admin-content">
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
            >Encerrar Sala</Button>
          </div>
        </div>
      </header>
      {
        isEnded ? <div>Sala encerrada</div> : (
          <main>
            <div className="room-title">
              <h1>Sala {title}</h1>
              {
                questions.length > 0 && (
                  <span>
                    {questions.length > 1 ? `${questions.length} Perguntas` : `${questions.length} Pergunta`}
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
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handelCheckQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como Respondida." />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta." />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handelDeleteQuestion(question.id)}
                    >
                      <img src={deleteImage} alt="Excluir pergunta." />
                    </button>
                  </Question>
                )
              })}
            </div>
          </main>
        )
      }
    </div>
  )
}