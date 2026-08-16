import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, Layers, Thermometer, Activity, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { MOCK_PREDICTIONS, LCZ_CLASSES } from '../data/lczData'
import { getHealth } from '../services/api'

const StatCard = ({ icon: Icon, label, value, sub, color = 'blue' }) => {
  const colors = { blue: 'text-blue-400 bg-blue-600/15', green: 'text-emerald-400 bg-emerald-600/15', orange: 'text-orange-400 bg-orange-600/15', purple: 'text-purple-400 bg-purple-600/15' }
  return (
    <div className="stat-card">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={18} className={colors[color].split(' ')[0]} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    getHealth()
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'))
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Urban Micro-Climate & Heat Mapping — Pune Study Area</p>
      </div>

      {/* API Status Banner */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg mb-6 text-sm border ${
        apiStatus === 'online'
          ? 'bg-emerald-600/10 border-emerald-600/30 text-emerald-400'
          : apiStatus === 'offline'
          ? 'bg-red-600/10 border-red-600/30 text-red-400'
          : 'bg-slate-600/10 border-slate-600/30 text-slate-400'
      }`}>
        {apiStatus === 'online' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
        <span>
          {apiStatus === 'online' && 'Backend API online — model ready for inference'}
          {apiStatus === 'offline' && 'Backend API offline — start the FastAPI server to enable predictions'}
          {apiStatus === 'checking' && 'Checking API status…'}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Layers} label="LCZ Classes" value="17" sub="Stewart & Oke (2012)" color="blue" />
        <StatCard icon={Brain} label="Model Input" value="18ch" sub="S1 (4ch) + S2 (14ch)" color="purple" />
        <StatCard icon={Activity} label="Patch Size" value="32×32" sub="Pixels per sample" color="green" />
        <StatCard icon={Thermometer} label="Study Area" value="Pune" sub="Maharashtra, India" color="orange" />
      </div>

      {/* Middle row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Satellite info */}
        <div className="card lg:col-span-2">
          <p className="section-title">Satellite Data Sources</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#0d1526] rounded-lg p-4 border border-[#1e2d45]">
              <p className="text-xs text-blue-400 font-semibold mb-2">Sentinel-1 SAR</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p>• 4 channels (VV, VH, VV/VH, VH/VV)</p>
                <p>• C-band synthetic aperture radar</p>
                <p>• All-weather, day/night imaging</p>
                <p>• 10m spatial resolution</p>
              </div>
            </div>
            <div className="bg-[#0d1526] rounded-lg p-4 border border-[#1e2d45]">
              <p className="text-xs text-emerald-400 font-semibold mb-2">Sentinel-2 MSI</p>
              <div className="space-y-1.5 text-xs text-slate-400">
                <p>• 14 spectral bands (B2–B12 + indices)</p>
                <p>• Multispectral optical imagery</p>
                <p>• 10–60m spatial resolution</p>
                <p>• Includes SWIR, NIR, Red-Edge</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="card">
          <p className="section-title">Quick Actions</p>
          <div className="space-y-2">
            {[
              { label: 'Run LCZ Prediction', to: '/predict', color: 'btn-primary' },
              { label: 'View Interactive Map', to: '/map', color: 'btn-secondary' },
              { label: 'Heat Analysis', to: '/heat-analysis', color: 'btn-secondary' },
              { label: 'LCZ Class Guide', to: '/lcz-info', color: 'btn-secondary' },
            ].map(({ label, to, color }) => (
              <button key={to} className={`${color} w-full flex items-center justify-between text-sm`} onClick={() => navigate(to)}>
                {label} <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent predictions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="section-title mb-0">Recent Predictions</p>
          <span className="badge bg-slate-700/50 text-slate-400 text-xs">Mock data</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-[#1e2d45]">
                <th className="pb-2 font-medium">LCZ Class</th>
                <th className="pb-2 font-medium">Confidence</th>
                <th className="pb-2 font-medium">Location</th>
                <th className="pb-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PREDICTIONS.map((p) => {
                const lcz = LCZ_CLASSES.find(c => c.code === p.class)
                return (
                  <tr key={p.id} className="border-b border-[#1e2d45]/50 last:border-0">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lcz?.color || '#64748b' }} />
                        <span className="font-medium">{p.class}</span>
                        <span className="text-slate-500 text-xs hidden sm:inline">— {lcz?.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#1e2d45] rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.confidence}%` }} />
                        </div>
                        <span className="text-slate-300">{p.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-400">{p.location}</td>
                    <td className="py-2.5 text-slate-500 text-xs">
                      <Clock size={11} className="inline mr-1" />{p.timestamp}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
