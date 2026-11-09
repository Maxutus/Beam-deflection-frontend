import './LoginPage.css'
import { type ChangeEvent, type FC, type FormEvent, useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ROUTES } from '../Routes'
import { api } from '../api'
import type { AppDispatch, RootState } from '../store'
import { setError, setUser } from '../slices/userSlice'
import { Loader } from '../components/Loader'

interface LoginResponse {
  access_token: string
  login: string
}

const LoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ login: '', password: '' })
  const [loading, setLoading] = useState(false)
  const error = useSelector((state: RootState) => state.user.error)

  useEffect(() => {
    document.title = 'Вход'
    dispatch(setError(null))
  }, [dispatch])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (!formData.login || !formData.password) {
      return
    }
    setLoading(true)
    try {
      const response = await axios.post<LoginResponse>('/api/users/login', formData)
      localStorage.setItem('token', response.data.access_token)
      api.setSecurityData(response.data.access_token)
      dispatch(setUser(response.data.login))
      navigate(ROUTES.TILES)
    } catch {
      dispatch(setError('Неверный логин или пароль'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Вход</h1>
      </header>

      <Form className="login" onSubmit={handleLogin}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="login__field" controlId="login">
          <Form.Label className="login__label">Логин</Form.Label>
          <Form.Control
            className="login__input"
            name="login"
            value={formData.login}
            autoComplete="username"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="login__field" controlId="password">
          <Form.Label className="login__label">Пароль</Form.Label>
          <Form.Control
            className="login__input"
            type="password"
            name="password"
            value={formData.password}
            autoComplete="current-password"
            onChange={handleChange}
          />
        </Form.Group>

        <Button className="lm-button" type="submit" disabled={loading}>
          Войти
        </Button>
      </Form>

      {loading && <Loader />}
    </>
  )
}

export default LoginPage
