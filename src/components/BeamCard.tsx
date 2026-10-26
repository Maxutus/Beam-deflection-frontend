import './BeamCard.css'
import { type FC, useState } from 'react'
import { Card } from 'react-bootstrap'
import { DEFAULT_IMAGE, formatNumber } from '../modules/beamsApi'

interface Props {
  name: string
  image_url: string
  deflection: number
  like_count: number
  onClick: () => void
}

export const BeamCard: FC<Props> = ({ name, image_url, deflection, like_count, onClick }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const imageSrc = !image_url || imageFailed ? DEFAULT_IMAGE : image_url

  return (
    <Card className="tile" onClick={onClick}>
      <div className="tile__thumb">
        <Card.Img className="tile__image" src={imageSrc} alt={name} onError={() => setImageFailed(true)} />
      </div>
      <Card.Body className="tile__body">
        <span className="tile__label">Прогиб</span>
        <span className="tile__value">
          {formatNumber(deflection)} <span className="tile__unit">мм</span>
        </span>
        <Card.Title className="tile__name">{name}</Card.Title>
        <span className="tile__likes">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FDC300" stroke="#334043" strokeWidth="1.6">
            <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.7a5.2 5.2 0 0 1 9.3 5.3C19.5 16.4 12 21 12 21z" />
          </svg>
          {like_count}
        </span>
      </Card.Body>
    </Card>
  )
}

export default BeamCard
