import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { ROUTES } from '../Routes'

const NotFoundPage: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="message">
      <h2 className="message__title">Страница не найдена</h2>
      <span>Такого адреса в приложении нет</span>
      <Button className="lm-button" onClick={() => navigate(ROUTES.TILES)}>
        К списку балок
      </Button>
    </div>
  )
}

export default NotFoundPage
