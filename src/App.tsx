import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from './Routes'
import type { Beam } from './modules/beamsApi'
import { BEAMS_MOCK } from './modules/mock'
import { TabBar } from './components/TabBar'
import TilesPage from './pages/TilesPage'
import FeedPage from './pages/FeedPage'
import DraftPage from './pages/DraftPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const [beams] = useState<Beam[]>(BEAMS_MOCK)

  return (
    <BrowserRouter>
      <div className="phone">
        <main className="phone__content">
          <Routes>
            <Route path="/" element={<Navigate to={ROUTES.TILES} replace />} />
            <Route path={ROUTES.TILES} element={<TilesPage beams={beams} />} />
            <Route path={ROUTES.FEED} element={<FeedPage beams={beams} />} />
            <Route path={`${ROUTES.FEED}/:id`} element={<FeedPage beams={beams} />} />
            <Route path={ROUTES.DRAFT} element={<DraftPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}

export default App
