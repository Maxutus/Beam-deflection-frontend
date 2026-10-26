import './FeedPage.css'
import { type FC, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { ROUTES } from '../Routes'
import { type Beam, DEFAULT_IMAGE, DEFAULT_VIDEO, formatNumber } from '../modules/beamsApi'

interface Props {
  beams: Beam[]
}

const FeedPage: FC<Props> = ({ beams }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const index = id ? beams.findIndex((beam) => beam.id === Number(id)) : 0
  const beam = beams[index]

  useEffect(() => {
    setExpanded(false)
    setVideoFailed(false)
  }, [id])

  useEffect(() => {
    document.title = beam ? beam.name : 'Лента балок'
  }, [beam])

  if (!beam) {
    return (
      <div className="message">
        <h2 className="message__title">Балка не найдена</h2>
        <span>Возможно, её удалили или адрес набран с ошибкой</span>
        <Button className="lm-button" onClick={() => navigate(ROUTES.TILES)}>
          К списку балок
        </Button>
      </div>
    )
  }

  const nextBeam = beams[(index + 1) % beams.length]
  const videoSrc = !beam.video_url || videoFailed ? DEFAULT_VIDEO : beam.video_url

  return (
    <section className="feed">
      <video
        key={videoSrc}
        className="feed__video"
        src={videoSrc}
        poster={beam.image_url || DEFAULT_IMAGE}
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoFailed(true)}
      />

      <div className="feed__shade" />

      <div className="feed__overlay">
        <div className="feed__bottom">
          <h1 className="feed__name">{beam.name}</h1>

          <div className="feed__params">
            <div className="feed__param">
              <span className="feed__param-label">Прогиб</span>
              <span className="feed__param-value">
                {formatNumber(beam.deflection)} <span className="feed__param-unit">мм</span>
              </span>
            </div>
            <div className="feed__param">
              <span className="feed__param-label">Нагрузка</span>
              <span className="feed__param-value">
                {formatNumber(beam.load)} <span className="feed__param-unit">кН/м</span>
              </span>
            </div>
          </div>

          <p className={expanded ? 'feed__description feed__description--open' : 'feed__description'}>
            {beam.description}
          </p>
          <Button variant="link" className="feed__toggle" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'меньше' : 'больше'}
          </Button>
        </div>

        <div className="feed__side">
          <span className="feed__side-button feed__side-button--like" title="Лайки">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.7a5.2 5.2 0 0 1 9.3 5.3C19.5 16.4 12 21 12 21z" />
            </svg>
            <span className="feed__side-count">{beam.like_count}</span>
          </span>
          <button
            type="button"
            className="feed__side-button feed__side-button--next"
            title="Следующая балка"
            onClick={() => navigate(`${ROUTES.FEED}/${nextBeam.id}`)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="19" y2="12" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeedPage
