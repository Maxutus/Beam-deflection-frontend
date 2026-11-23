import './TabBar.css'
import type { FC } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { LOGOUT_LABEL, ROUTES, ROUTE_LABELS } from '../Routes'
import { api } from '../api'
import type { AppDispatch, RootState } from '../store'
import { resetUser } from '../slices/userSlice'
import { getBeamsList } from '../slices/beamsSlice'
import { isPagesBuild } from '../modules/deployment'

export const TabBar: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated)

  const isFeed = location.pathname.startsWith(ROUTES.FEED)
  const isTiles = location.pathname === ROUTES.TILES
  const isDraft = location.pathname === ROUTES.DRAFT
  const isLogin = location.pathname === ROUTES.LOGIN

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    await axios
      .post('/api/users/logout', null, { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => undefined)
    localStorage.removeItem('token')
    api.setSecurityData(null)
    dispatch(resetUser())
    navigate(ROUTES.TILES)
    dispatch(getBeamsList())
  }

  return (
    <Navbar expand className="tabbar">
      <Nav className="tabbar__nav">
        <Nav.Link as="button" className="tabbar__item" active={isFeed} onClick={() => navigate(ROUTES.FEED)}>
          <svg className="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M9 6.5 18 12l-9 5.5z" />
          </svg>
          <span>{ROUTE_LABELS.FEED}</span>
        </Nav.Link>
        <Nav.Link
          as="button"
          className="tabbar__item"
          active={isDraft}
          disabled={isPagesBuild || !isAuthenticated}
          onClick={() => navigate(ROUTES.DRAFT)}
        >
          <svg className="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>{ROUTE_LABELS.DRAFT}</span>
        </Nav.Link>
        <Nav.Link as="button" className="tabbar__item" active={isTiles} onClick={() => navigate(ROUTES.TILES)}>
          <svg className="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="7" height="7" rx="1" />
            <rect x="13" y="4" width="7" height="7" rx="1" />
            <rect x="4" y="13" width="7" height="7" rx="1" />
            <rect x="13" y="13" width="7" height="7" rx="1" />
          </svg>
          <span>{ROUTE_LABELS.TILES}</span>
        </Nav.Link>
        <Nav.Link
          as="button"
          className="tabbar__item"
          active={isLogin}
          disabled={isPagesBuild}
          onClick={isAuthenticated ? handleLogout : () => navigate(ROUTES.LOGIN)}
        >
          <svg className="tabbar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h5v16h-5" />
            <path d="M4 12h11" />
            <path d="M11 8l4 4-4 4" />
          </svg>
          <span>{isAuthenticated ? LOGOUT_LABEL : ROUTE_LABELS.LOGIN}</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
