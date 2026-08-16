import { Info, AlertTriangle } from 'lucide-react'

const Placeholder = ({ label }) => (
  <span className="text-slate-500 italic text-sm">{label} — to be filled with actual values</span>
)

const MetricRow = ({ label, value, placeholder }) => (
  <div className="flex justify-between items-center py-2 border-b border-[#1e2d45] last:border-0 text-sm">
    <span className="text-slate-400">{label}</span>
    {value ? <span className="font-medium text-slate-200">{value}</span> : <Placeholder label={placeholder || 'Value'} />}
  </div>
)

export default function ModelInfo() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Model Information</h1>
        <p className="text-slate-400 text-sm">Architecture, training details, and performance metrics</p>
      </div>

      {/* Notice */}
      <div className="flex gap-3 p-4 rounded-lg bg-blue-600/10 border border-blue-600/30 mb-6 text-sm">
        <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-blue-200/80">
          Performance metrics are placeholders. Replace with actual values from your training logs once available.
          Do not fabricate scientific results.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Architecture */}
        <div className="card">
          <p className="section-title">Model Architecture</p>
          <div className="space-y-0">
            <MetricRow label="Framework" value="TensorFlow / Keras" />
            <MetricRow label="Format" value=".h5 (HDF5)" />
            <MetricRow label="Task" value="Multi-class Classification" />
            <MetricRow label="Input Shape" value="(32, 32, 18)" />
            <MetricRow label="Input Channels" value="18 (S1: 4 + S2: 14)" />
            <MetricRow label="Output Classes" value="17 LCZ classes" />
            <MetricRow label="Output Activation" value="Softmax" />
          </div>
        </div>

        {/* Training dataset */}
        <div className="card">
          <p className="section-title">Training Dataset</p>
          <div className="space-y-0">
            <MetricRow label="Dataset" value="So2Sat-LCZ42" />
            <MetricRow label="Satellite Sources" value="Sentinel-1 + Sentinel-2" />
            <MetricRow label="Patch Size" value="32 × 32 pixels" />
            <MetricRow label="Number of Classes" value="17 LCZ classes" />
            <MetricRow label="Geographic Coverage" value="42 global cities" />
            <MetricRow label="Training Split" placeholder="Training/Val/Test split" />
            <MetricRow label="Total Samples" placeholder="Number of training samples" />
          </div>
        </div>

        {/* Sentinel-1 */}
        <div className="card">
          <p className="section-title">Sentinel-1 SAR Channels (4ch)</p>
          <div className="space-y-2 text-sm">
            {[
              { ch: 'Ch 1', name: 'VV', desc: 'Vertical transmit, Vertical receive' },
              { ch: 'Ch 2', name: 'VH', desc: 'Vertical transmit, Horizontal receive' },
              { ch: 'Ch 3', name: 'VV/VH', desc: 'Ratio: VV divided by VH' },
              { ch: 'Ch 4', name: 'VH/VV', desc: 'Ratio: VH divided by VV' },
            ].map(({ ch, name, desc }) => (
              <div key={ch} className="flex items-start gap-3 py-1.5 border-b border-[#1e2d45] last:border-0">
                <span className="text-xs text-slate-600 w-10 shrink-0 mt-0.5">{ch}</span>
                <span className="font-mono text-blue-400 text-xs w-12 shrink-0">{name}</span>
                <span className="text-slate-400 text-xs">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentinel-2 */}
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
              <div key={ch} className="flex items-center gap-3 py-1 border-b border-[#1e2d45]/50 last:border-0">
                <span className="text-slate-600 w-12 shrink-0">{ch}</span>
                <span className="font-mono text-emerald-400 w-14 shrink-0">{name}</span>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance metrics */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title mb-0">Performance Metrics</p>
            <span className="badge bg-amber-600/20 text-amber-400 border border-amber-600/30">
              <AlertTriangle size={11} /> Placeholders
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Overall Accuracy', key: 'accuracy' },
              { label: 'Macro Precision', key: 'precision' },
              { label: 'Macro Recall', key: 'recall' },
              { label: 'Macro F1-Score', key: 'f1' },
            ].map(({ label, key }) => (
              <div key={key} className="bg-[#0d1526] rounded-lg p-4 border border-[#1e2d45] text-center">
                <p className="text-xs text-slate-500 mb-2">{label}</p>
                <p className="text-slate-600 italic text-sm">—</p>
                <p className="text-xs text-slate-700 mt-1">Add from training logs</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#0d1526] rounded-lg border border-[#1e2d45]">
            <p className="text-xs text-slate-500 mb-1 font-medium">Confusion Matrix</p>
            <p className="text-xs text-slate-600">
              Export the confusion matrix from your training notebook and add it here as an image or
              as a 17×17 matrix array in <code className="text-slate-400">src/data/confusionMatrix.js</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
