import { Info, AlertTriangle } from 'lucide-react'

const Placeholder = () => (
  <span className="text-zinc-700 italic text-sm">— add from training logs</span>
)

const MetricRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-[#242424] last:border-0 text-sm">
    <span className="text-zinc-500">{label}</span>
    {value ? <span className="font-medium text-zinc-200">{value}</span> : <Placeholder />}
  </div>
)

export default function ModelInfo() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Model Information</h1>
        <p className="text-zinc-500 text-sm">Architecture, training details, and performance metrics</p>
      </div>

      <div className="flex gap-3 p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 mb-6 text-sm">
        <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-zinc-400">
          Performance metrics are placeholders. Replace with actual values from your training logs.
          Do not fabricate scientific results.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <p className="section-title">Model Architecture</p>
          <MetricRow label="Framework" value="TensorFlow / Keras" />
          <MetricRow label="Format" value=".h5 (HDF5)" />
          <MetricRow label="Task" value="Multi-class Classification" />
          <MetricRow label="Input Shape" value="(32, 32, 18)" />
          <MetricRow label="Input Channels" value="18 (S1: 4 + S2: 14)" />
          <MetricRow label="Output Classes" value="17 LCZ classes" />
          <MetricRow label="Output Activation" value="Softmax" />
        </div>

        <div className="card">
          <p className="section-title">Training Dataset</p>
          <MetricRow label="Dataset" value="So2Sat-LCZ42" />
          <MetricRow label="Satellite Sources" value="Sentinel-1 + Sentinel-2" />
          <MetricRow label="Patch Size" value="32 × 32 pixels" />
          <MetricRow label="Number of Classes" value="17 LCZ classes" />
          <MetricRow label="Geographic Coverage" value="42 global cities" />
          <MetricRow label="Training Split" value={null} />
          <MetricRow label="Total Samples" value={null} />
        </div>

        <div className="card">
          <p className="section-title">Sentinel-1 SAR Channels (4ch)</p>
          <div className="space-y-2 text-sm">
            {[
              { ch: 'Ch 1', name: 'VV', desc: 'Vertical transmit, Vertical receive' },
              { ch: 'Ch 2', name: 'VH', desc: 'Vertical transmit, Horizontal receive' },
              { ch: 'Ch 3', name: 'VV/VH', desc: 'Ratio: VV divided by VH' },
              { ch: 'Ch 4', name: 'VH/VV', desc: 'Ratio: VH divided by VV' },
            ].map(({ ch, name, desc }) => (
              <div key={ch} className="flex items-start gap-3 py-1.5 border-b border-[#242424] last:border-0">
                <span className="text-xs text-zinc-700 w-10 shrink-0 mt-0.5">{ch}</span>
                <span className="font-mono text-amber-400 text-xs w-12 shrink-0">{name}</span>
                <span className="text-zinc-500 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <p className="section-title">Sentinel-2 MSI Channels (14ch)</p>
          <div className="space-y-1 text-xs max-h-52 overflow-y-auto">
            {[
              { ch: 'Ch 5', name: 'B2', desc: 'Blue (490nm)' },
              { ch: 'Ch 6', name: 'B3', desc: 'Green (560nm)' },
              { ch: 'Ch 7', name: 'B4', desc: 'Red (665nm)' },
              { ch: 'Ch 8', name: 'B5', desc: 'Red Edge 1 (705nm)' },
              { ch: 'Ch 9', name: 'B6', desc: 'Red Edge 2 (740nm)' },
              { ch: 'Ch 10', name: 'B7', desc: 'Red Edge 3 (783nm)' },
              { ch: 'Ch 11', name: 'B8', desc: 'NIR (842nm)' },
              { ch: 'Ch 12', name: 'B8A', desc: 'Narrow NIR (865nm)' },
              { ch: 'Ch 13', name: 'B11', desc: 'SWIR 1 (1610nm)' },
              { ch: 'Ch 14', name: 'B12', desc: 'SWIR 2 (2190nm)' },
              { ch: 'Ch 15–18', name: 'Indices', desc: 'NDVI, NDBI, MNDWI, EVI (configurable)' },
            ].map(({ ch, name, desc }) => (
              <div key={ch} className="flex items-center gap-3 py-1 border-b border-[#242424]/50 last:border-0">
                <span className="text-zinc-700 w-12 shrink-0">{ch}</span>
                <span className="font-mono text-emerald-500 w-14 shrink-0">{name}</span>
                <span className="text-zinc-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title mb-0">Performance Metrics</p>
            <span className="badge bg-zinc-800 text-zinc-500 border border-zinc-700 text-xs">
              <AlertTriangle size={11} /> Placeholders
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Overall Accuracy', 'Macro Precision', 'Macro Recall', 'Macro F1-Score'].map((label) => (
              <div key={label} className="bg-[#0f0f0f] rounded-lg p-4 border border-[#242424] text-center">
                <p className="text-xs text-zinc-600 mb-2">{label}</p>
                <p className="text-zinc-700 italic text-sm">—</p>
                <p className="text-xs text-zinc-800 mt-1">Add from training logs</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#0f0f0f] rounded-lg border border-[#242424]">
            <p className="text-xs text-zinc-600 mb-1 font-medium">Confusion Matrix</p>
            <p className="text-xs text-zinc-700">
              Export the confusion matrix from your training notebook and add it as an image or
              17×17 matrix array in <code className="text-zinc-500">src/data/confusionMatrix.js</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
