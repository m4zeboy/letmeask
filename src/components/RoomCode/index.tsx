import toast, { Toaster} from 'react-hot-toast'
import copyImg from '../../assets/images/copy.svg';
import './styles.scss';

type RoomCodeProps = {
  code: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code)
    toast.success('Copiado', {
      position: 'top-center',
    })
  }

  return (
    <>
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy Room Code." />
        </div>
        <span>Sala #{props.code}</span>
      </button>
      <Toaster toastOptions={{ 
        success: {
          style: {
            background: '#2C3F2C',
            color: '#3AFF3A',
          }
        }
      }}/>
    </>
  )
}