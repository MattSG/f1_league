import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import TrackSelection from './pages/TrackSelection'
import Weather from './pages/Weather'

const basename = import.meta.env.BASE_URL

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<TrackSelection />} />
          <Route path="track" element={<TrackSelection />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
