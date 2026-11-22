import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { registerSW } from 'virtual:pwa-register'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

if ('serviceWorker' in navigator) {
  registerSW({
    onRegisterError(error) {
      console.error('Не удалось зарегистрировать Service Worker', error)
    },
  })
}
