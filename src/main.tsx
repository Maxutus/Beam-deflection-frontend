import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { store } from './store'
import { isPagesBuild, publicAsset } from './modules/deployment'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

if (isPagesBuild) {
  const manifest = document.createElement('link')
  manifest.rel = 'manifest'
  manifest.href = publicAsset('manifest.webmanifest')
  document.head.append(manifest)

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(publicAsset('sw.js')).catch((error: unknown) => {
      console.error('Не удалось подготовить офлайн-режим', error)
    })
  }
}
