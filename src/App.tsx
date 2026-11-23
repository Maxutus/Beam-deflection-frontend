import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './Routes'
import { TabBar } from './components/TabBar'
import TilesPage from './pages/TilesPage'
import FeedPage from './pages/FeedPage'
import DraftPage from './pages/DraftPage'
import LoginPage from './pages/LoginPage'
import { isPagesBuild } from './modules/deployment'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="phone">
        <main className="phone__content">
          <Routes>
            <Route path={ROUTES.TILES} element={<TilesPage />} />
            <Route path={ROUTES.FEED} element={<FeedPage />} />
            <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage />} />
            {!isPagesBuild && <Route path={ROUTES.DRAFT} element={<DraftPage />} />}
            {!isPagesBuild && <Route path={ROUTES.LOGIN} element={<LoginPage />} />}
            <Route path="*" element={<Navigate to={ROUTES.FEED} replace />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}

export default App
