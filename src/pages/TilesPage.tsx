import './TilesPage.css'
import { type FC, useEffect } from 'react'
import { Alert, Pagination } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import type { AppDispatch, RootState } from '../store'
import { deleteBeam, getBeamsList, setCurrentPage } from '../slices/beamsSlice'
import { InputField } from '../components/InputField'
import { BeamCard } from '../components/BeamCard'
import { Loader } from '../components/Loader'

const TilesPage: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { searchValue, beams, currentPage, totalPages, total, listLoading, listError } = useSelector(
    (state: RootState) => state.beams,
  )
  const { login, isAuthenticated } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    document.title = 'Балки'
    dispatch(getBeamsList())
  }, [dispatch])

  function changePage(page: number) {
    dispatch(setCurrentPage(page))
    dispatch(getBeamsList())
  }

  async function removeBeam(id: number) {
    const result = await dispatch(deleteBeam(id))
    if (deleteBeam.fulfilled.match(result)) dispatch(getBeamsList())
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Балки</h1>
        {isAuthenticated && <span className="lm-badge lm-badge--accent page-header__login">{login}</span>}
      </header>

      <InputField value={searchValue} loading={listLoading} />

      <span className="tiles__count" aria-live="polite">Найдено балок: {total}</span>

      {listError && <Alert variant="danger" className="tiles__error">{listError}</Alert>}

      {totalPages > 1 && (
        <nav className="tiles__pagination" aria-label="Страницы балок">
          <Pagination size="sm" className="mb-0">
            <Pagination.First aria-label="Первая страница" disabled={listLoading || isFirstPage} onClick={() => changePage(1)} />
            <Pagination.Prev aria-label="Предыдущая страница" disabled={listLoading || isFirstPage} onClick={() => changePage(currentPage - 1)} />
            <Pagination.Item active activeLabel="(текущая страница)">{currentPage} / {totalPages}</Pagination.Item>
            <Pagination.Next aria-label="Следующая страница" disabled={listLoading || isLastPage} onClick={() => changePage(currentPage + 1)} />
            <Pagination.Last aria-label="Последняя страница" disabled={listLoading || isLastPage} onClick={() => changePage(totalPages)} />
          </Pagination>
        </nav>
      )}

      {beams.length === 0 && !listLoading && !listError && (
        <div className="message">
          <h2 className="message__title">Балок не найдено</h2>
          <span>Попробуйте увеличить допустимый прогиб</span>
        </div>
      )}
      {beams.length > 0 && (
        <section className="tiles">
          {beams.map((beam) => (
            <BeamCard
              key={beam.id}
              {...beam}
              onClick={() => navigate(`${ROUTES.FEED}/${beam.id}`)}
              onDelete={isAuthenticated && beam.is_mine ? () => void removeBeam(beam.id) : undefined}
            />
          ))}
        </section>
      )}

      {listLoading && <Loader />}
    </>
  )
}

export default TilesPage
