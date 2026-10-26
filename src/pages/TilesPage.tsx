import './TilesPage.css'
import { type FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../Routes'
import type { Beam } from '../modules/beamsApi'
import { InputField } from '../components/InputField'
import { BeamCard } from '../components/BeamCard'

interface Props {
  beams: Beam[]
}

const TilesPage: FC<Props> = ({ beams }) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [visibleBeams, setVisibleBeams] = useState<Beam[]>(beams)

  useEffect(() => {
    setVisibleBeams(beams)
  }, [beams])

  useEffect(() => {
    document.title = 'Балки'
  }, [])

  const handleSearch = () => {
    const text = searchValue.trim().replace(',', '.')
    const maxDeflection = Number(text)

    if (text === '' || Number.isNaN(maxDeflection)) {
      setVisibleBeams(beams)
      return
    }

    setVisibleBeams(beams.filter((beam) => beam.deflection <= maxDeflection))
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Балки</h1>
      </header>

      <InputField
        value={searchValue}
        setValue={setSearchValue}
        onSubmit={handleSearch}
        placeholder="Прогиб до, мм"
      />

      <span className="tiles__count">Найдено балок: {visibleBeams.length}</span>

      {visibleBeams.length === 0 ? (
        <div className="message">
          <h2 className="message__title">Балок не найдено</h2>
          <span>Попробуйте увеличить допустимый прогиб</span>
        </div>
      ) : (
        <section className="tiles">
          {visibleBeams.map((beam) => (
            <BeamCard key={beam.id} {...beam} onClick={() => navigate(`${ROUTES.FEED}/${beam.id}`)} />
          ))}
        </section>
      )}
    </>
  )
}

export default TilesPage
