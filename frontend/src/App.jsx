import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Predict from './pages/Predict'
import LCZInfo from './pages/LCZInfo'
import MapView from './pages/MapView'
import HeatAnalysis from './pages/HeatAnalysis'
import ModelInfo from './pages/ModelInfo'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/heat-analysis" element={<HeatAnalysis />} />
          <Route path="/lcz-info" element={<LCZInfo />} />
          <Route path="/model-info" element={<ModelInfo />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
