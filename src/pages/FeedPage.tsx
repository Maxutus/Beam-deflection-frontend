import './FeedPage.css'
import { type FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { ROUTES } from '../Routes'
import { DEFAULT_IMAGE, DEFAULT_VIDEO, formatNumber } from '../modules/beamsApi'
import type { AppDispatch, RootState } from '../store'
import { getFeedBeam, likeBeam } from '../slices/beamsSlice'
import { Loader } from '../components/Loader'

const FeedPage: FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { feedBeam: beam, loading } = useSelector((state: RootState) => state.beams)
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)
  const [expanded, setExpanded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    setExpanded(false)
    setVideoFailed(false)
    if (beam && id && beam.id === Number(id)) {
      return
    }
    dispatch(getFeedBeam({ id: id ? Number(id) : undefined }))
  }, [id])

  useEffect(() => {
    document.title = beam ? beam.name : 'Лента балок'
  }, [beam])

  const handleNext = async () => {
    if (!beam) {
      return
    }
    const action = await dispatch(getFeedBeam({ id: beam.id, next: true }))
    if (getFeedBeam.fulfilled.match(action)) {
      navigate(`${ROUTES.FEED}/${action.payload.id}`)
    }
  }

  const handleLike = () => {
    if (beam) {
      dispatch(likeBeam({ id: beam.id, like: beam.is_liked ? 0 : 1 }))
    }
  }

  if (!beam) {
    return loading ? (
      <Loader />
    ) : (
      <div className="message">
        <h2 className="message__title">Балка не найдена</h2>
        <span>Возможно, её удалили или адрес набран с ошибкой</span>
        <Button className="lm-button" onClick={() => navigate(ROUTES.TILES)}>
          К списку балок
        </Button>
      </div>
    )
  }

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
          <button
            type="button"
            className={beam.is_liked ? 'feed__side-button feed__side-button--like feed__side-button--liked' : 'feed__side-button feed__side-button--like'}
            title={isAuthenticated ? 'Лайк' : 'Лайки доступны после входа'}
            disabled={!isAuthenticated || loading}
            onClick={handleLike}
          >
            <svg viewBox="0 0 24 24" fill={beam.is_liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.7a5.2 5.2 0 0 1 9.3 5.3C19.5 16.4 12 21 12 21z" />
            </svg>
            <span className="feed__side-count">{beam.like_count}</span>
          </button>
          <button
            type="button"
            className="feed__side-button feed__side-button--next"
            title="Следующая балка"
            disabled={loading}
            onClick={handleNext}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="12" x2="19" y2="12" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {loading && <Loader />}
    </section>
  )
}

export default FeedPage
