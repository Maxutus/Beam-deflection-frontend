import './TilesPage.css'
import { type FC, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import type { AppDispatch, RootState } from '../store'
import { deleteBeam, getBeamsList } from '../slices/beamsSlice'
import { InputField } from '../components/InputField'
import { BeamCard } from '../components/BeamCard'
import { Loader } from '../components/Loader'

const TilesPage: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { searchValue, beams, loading, error } = useSelector((state: RootState) => state.beams)
  const { login, isAuthenticated } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    document.title = 'Балки'
    dispatch(getBeamsList())
  }, [dispatch])

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Балки</h1>
        {isAuthenticated && <span className="lm-badge lm-badge--accent page-header__login">{login}</span>}
      </header>

      <InputField value={searchValue} loading={loading} />

      <span className="tiles__count">Найдено балок: {beams.length}</span>

      {error && <Alert variant="danger" className="tiles__error">{error}</Alert>}

      {beams.length === 0 ? (
        <div className="message">
          <h2 className="message__title">Балок не найдено</h2>
          <span>Попробуйте увеличить допустимый прогиб</span>
        </div>
      ) : (
        <section className="tiles">
          {beams.map((beam) => (
            <BeamCard
              key={beam.id}
              {...beam}
              onClick={() => navigate(`${ROUTES.FEED}/${beam.id}`)}
              onDelete={isAuthenticated && beam.is_mine ? () => dispatch(deleteBeam(beam.id)) : undefined}
            />
          ))}
        </section>
      )}

      {loading && <Loader />}
    </>
  )
}

export default TilesPage
