import './Loader.css'
import type { FC } from 'react'
import { Spinner } from 'react-bootstrap'

export const Loader: FC = () => (
  <div className="loader">
    <Spinner animation="border" className="loader__spinner" />
  </div>
)

export default Loader
