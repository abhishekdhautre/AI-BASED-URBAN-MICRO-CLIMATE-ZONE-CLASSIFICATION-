import { useEffect, useRef, useState } from 'react'
import { Layers, Info } from 'lucide-react'
import { LCZ_CLASSES } from '../data/lczData'

const PUNE_CENTER = [18.5204, 73.8567]

const LAYER_OPTIONS = [
  { id: 'lcz', label: 'LCZ Classification', color: '#d97706' },
  { id: 'lst', label: 'Heat / LST', color: '#ef4444' },
  { id: 'vegetation', label: 'Vegetation (NDVI)', color: '#10b981' },
  { id: 'builtup', label: 'Built-up Intensity', color: '#f97316' },
]

const MOCK_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { name: 'Shivajinagar', lcz: 'LCZ 2', lst: 40.3 }, geometry: { type: 'Point', coordinates: [73.8478, 18.5308] } },
    { type: 'Feature', properties: { name: 'Kothrud', lcz: 'LCZ 6', lst: 33.4 }, geometry: { type: 'Point', coordinates: [73.8077, 18.5074] } },
    { type: 'Feature', properties: { name: 'Pimpri', lcz: 'LCZ 8', lst: 39.6 }, geometry: { type: 'Point', coordinates: [73.8567, 18.6298] } },
    { type: 'Feature', properties: { name: 'Baner', lcz: 'LCZ 5', lst: 35.8 }, geometry: { type: 'Point', coordinates: [73.7898, 18.5590] } },
    { type: 'Feature', properties: { name: 'Sinhagad', lcz: 'LCZ A', lst: 26.3 }, geometry: { type: 'Point', coordinates: [73.7553, 18.3665] } },
    { type: 'Feature', properties: { name: 'Hadapsar', lcz: 'LCZ 3', lst: 38.7 }, geometry: { type: 'Point', coordinates: [73.9259, 18.5018] } },
    { type: 'Feature', properties: { name: 'Viman Nagar', lcz: 'LCZ 5', lst: 35.8 }, geometry: { type: 'Point', coordinates: [73.9145, 18.5679] } },
    { type: 'Feature', properties: { name: 'Pashan Lake', lcz: 'LCZ G', lst: 24.1 }, geometry: { type: 'Point', coordinates: [73.7985, 18.5362] } },
  ],
}

export default function MapView() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [activeLayers, setActiveLayers] = useState(['lcz'])
  const [selectedFeature, setSelectedFeature] = useState(null)

  useEffect(() => {
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) return

      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, { zoomControl: false }).setView(PUNE_CENTER, 11)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      MOCK_GEOJSON.features.forEach((feature) => {
        const { name, lcz, lst } = feature.properties
        const [lng, lat] = feature.geometry.coordinates
        const lczInfo = LCZ_CLASSES.find(c => c.code === lcz)

        const marker = L.circleMarker([lat, lng], {
          radius: 10,
          fillColor: lczInfo?.color || '#52525b',
          color: '#fff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map)

        marker.on('click', () => setSelectedFeature({ name, lcz, lst, lczInfo }))
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const toggleLayer = (id) =>
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Interactive Map</h1>
        <p className="text-zinc-500 text-sm">Pune LCZ & heat layer visualization — mock data shown</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden" style={{ height: '560px' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={15} className="text-zinc-500" />
              <p className="text-sm font-semibold text-zinc-200">Layers</p>
            </div>
            <div className="space-y-2">
              {LAYER_OPTIONS.map(({ id, label, color }) => (
                <label key={id} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggleLayer(id)}>
                  <div
                    className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0"
                    style={{ borderColor: color, backgroundColor: activeLayers.includes(id) ? color : 'transparent' }}
                  >
                    {activeLayers.includes(id) && <span className="text-white text-xs leading-none">✓</span>}
                  </div>
                  <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-zinc-700 mt-3 pt-3 border-t border-[#242424]">
              Real GIS layers can be connected via WMS/WFS endpoints
            </p>
          </div>

          <div className="card">
            <p className="text-sm font-semibold mb-3 text-zinc-200">LCZ Legend</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {LCZ_CLASSES.slice(0, 10).map((lcz) => (
                <div key={lcz.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: lcz.color }} />
                  <span className="text-xs text-zinc-500">{lcz.code} — {lcz.name}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedFeature && (
            <div className="card border-zinc-600">
              <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="text-amber-400" />
                <p className="text-sm font-semibold text-zinc-200">{selectedFeature.name}</p>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-600">LCZ Class</span>
                  <span className="text-zinc-200 font-medium">{selectedFeature.lcz}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Class Name</span>
                  <span className="text-zinc-300">{selectedFeature.lczInfo?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Mock LST</span>
                  <span className="text-orange-400 font-medium">{selectedFeature.lst}°C</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-700">
        <Info size={12} />
        Map shows mock sample points. Connect real GeoTIFF/GeoJSON layers in the backend for production use.
      </div>
    </div>
  )
}
