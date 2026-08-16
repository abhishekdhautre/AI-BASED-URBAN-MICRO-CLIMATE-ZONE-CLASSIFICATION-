import { useNavigate } from 'react-router-dom'
import { Thermometer, Satellite, Brain, MapPin, ArrowRight, Globe, Zap } from 'lucide-react'

const FEATURES = [
  { icon: Satellite, title: 'Sentinel Satellite Data', desc: 'Dual-source SAR (Sentinel-1) and optical (Sentinel-2) imagery for robust classification.' },
  { icon: Brain, title: 'Deep Learning Model', desc: 'Trained on So2Sat-LCZ42 dataset with 17 Local Climate Zone classes across global cities.' },
  { icon: MapPin, title: 'Pune Study Area', desc: 'Focused analysis on Pune, Maharashtra — a rapidly urbanizing Indian megacity.' },
  { icon: Thermometer, title: 'Heat Island Analysis', desc: 'Correlate LCZ classes with Land Surface Temperature to identify urban heat islands.' },
]

const STATS = [
  { value: '17', label: 'LCZ Classes' },
  { value: '32×32', label: 'Patch Size (px)' },
  { value: '18', label: 'Input Channels' },
  { value: 'S1+S2', label: 'Sentinel Data' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-zinc-100">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="badge bg-amber-600/15 text-amber-400 border border-amber-600/25">
            <Globe size={12} /> Remote Sensing · AI · Urban Climate
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-3xl text-white">
          Urban Micro-Climate &{' '}
          <span className="text-amber-400">Heat Mapping</span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-2xl mb-8 leading-relaxed">
          Automated Local Climate Zone classification using multi-spectral satellite imagery
          and deep learning — enabling data-driven urban heat island analysis for Pune.
        </p>

        <div className="flex flex-wrap gap-3 mb-16">
          <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/dashboard')}>
            Explore Dashboard <ArrowRight size={16} />
          </button>
          <button className="btn-secondary flex items-center gap-2" onClick={() => navigate('/predict')}>
            Try Prediction <Zap size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map(({ value, label }) => (
            <div key={label} className="card text-center">
              <p className="text-2xl font-bold text-amber-400">{value}</p>
              <p className="text-xs text-zinc-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What are LCZs */}
      <section className="px-6 py-12 bg-[#111111] border-y border-[#242424]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest mb-3">What are LCZs?</p>
              <h2 className="text-2xl font-bold mb-4 text-white">Local Climate Zones</h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Local Climate Zones (LCZs) are a standardized classification system developed by
                Stewart & Oke (2012) that categorizes urban and rural landscapes into 17 distinct
                classes based on surface cover, fabric, and human activity.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Each LCZ class has characteristic thermal properties that directly influence local
                air and surface temperatures — making LCZ mapping essential for understanding
                urban heat islands and planning climate-resilient cities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Built Types', items: ['Compact High-Rise', 'Open Mid-Rise', 'Lightweight Low-Rise', 'Heavy Industry'] },
                { label: 'Land Cover Types', items: ['Dense Trees', 'Low Plants', 'Bare Rock/Paved', 'Water'] },
              ].map(({ label, items }) => (
                <div key={label} className="card">
                  <p className="text-xs text-zinc-500 font-medium mb-2">{label}</p>
                  {items.map(item => (
                    <p key={item} className="text-sm text-zinc-300 py-1 border-b border-[#242424] last:border-0">{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest mb-3">Why It Matters</p>
        <h2 className="text-2xl font-bold mb-8 text-white">Urban Heat Islands & Climate Resilience</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-zinc-600 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-3">
                <Icon size={18} className="text-zinc-300" />
              </div>
              <h3 className="font-semibold text-sm mb-2 text-zinc-100">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="px-6 py-12 bg-[#111111] border-y border-[#242424]">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-amber-500 font-semibold uppercase tracking-widest mb-3">Methodology</p>
          <h2 className="text-2xl font-bold mb-8 text-white">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {[
              { step: '01', title: 'Satellite Acquisition', desc: 'Sentinel-1 SAR (4 channels) + Sentinel-2 optical (14 channels) imagery over Pune' },
              { step: '02', title: 'Patch Extraction', desc: '32×32 pixel patches extracted at target locations, forming 18-channel tensors' },
              { step: '03', title: 'LCZ Classification', desc: 'Deep learning model classifies each patch into one of 17 LCZ classes' },
              { step: '04', title: 'Heat Analysis', desc: 'LCZ map correlated with Land Surface Temperature for heat island identification' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex-1 flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-600/15 border border-amber-600/30 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                    {step}
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-[#242424] mt-2 hidden md:block" />}
                </div>
                <div className="pb-4">
                  <h3 className="font-semibold text-sm mb-1 text-zinc-100">{title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-3 text-white">Ready to Explore?</h2>
        <p className="text-zinc-400 mb-6">Upload satellite patches, explore the interactive map, and analyze urban heat patterns across Pune.</p>
        <button className="btn-primary flex items-center gap-2 mx-auto" onClick={() => navigate('/dashboard')}>
          Open Dashboard <ArrowRight size={16} />
        </button>
      </section>
    </div>
  )
}
